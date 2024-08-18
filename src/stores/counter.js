import { ref } from "vue";
import { defineStore } from "pinia";
import { db } from "@/db";
import { liveQuery } from "dexie";
import { useObservable } from "@vueuse/rxjs";
import { exportDB, importInto } from "dexie-export-import";
import { toast } from 'vue-sonner'

export const useCounterStore = defineStore("counter", () => {
  const status = ref("LOADING");
  const loaded_id = ref(null);
  const file_name = ref("");
  const project_name = ref("");
  const project_body = ref("");
  const searchTerm = ref("");
  const showProjects = ref(true);
  const showImportModal = ref(false);
  const shareOptions = ref([]);


  /**
   * "Restaura el editor estableciendo los valores de `loaded_id`, `project_name`, and `project_body`.
   *
   * @return {void} Esta función no devuelve nada.
   */
  function clear_editor() {
    loaded_id.value = "";
    project_name.value = "";
    project_body.value = "";
  }
  /**
   * Asincrónicamente crea un nuevo proyecto en la base de datos.
   *
   * @return {Promise<void>} Una promesa que se resuelve cuando el proyecto se crea correctamente,
   *                        o se rechaza con un error si falla la creación.
   */
  async function create_project() {
    try {
      status.value = "CHANGING";
      const new_project_id = await db.projects.add({
        date: new Date().toISOString(),
        createAd: new Date().toISOString(),
        project_data: {
          body: project_body.value,
          name: project_name.value,
        },
      });
      loaded_id.value = new_project_id;
      status.value = "READY";
    } catch (error) {
      handleError("Error al crear el proyecto", error);
    }
  }

  /**
   * Asincrónicamente actualiza un proyecto en la base de datos.
   *
   * @return {Promise<void>} Una promesa que se resuelve cuando el proyecto se actualiza correctamente,
   *                        o se rechaza con un error si la actualización falla.
   */
  async function update_project() {
    try {
      await db.projects.update(loaded_id.value, {
        date: new Date().toISOString(),
        project_data: {
          body: project_body.value,
          name: project_name.value,
        },
      });
    } catch (error) {
      handleError("Error al actualizar el proyecto", error);
    }
  }

  /**
   * Asincrónicamente establece el proyecto actual basado en el ID proporcionado.
   *
   * @param {string|null} id - El ID del proyecto a establecer. Si es nulo, limpia el editor.
   * @return {Promise<void>} Una promesa que se resuelve cuando el proyecto se establece correctamente,
   *                        o se rechaza con un error si falla el establecimiento.
   */
  async function set_project(id) {
    const selectedId = id ? parseInt(id, 10) : null;
    if (selectedId === loaded_id.value) return;
    status.value = "CHANGING";
    try {
      if (selectedId === null) {
        clear_editor();
      } else {
        const selectedState = await db.projects.get(selectedId);
        if (selectedState) {
          project_body.value = selectedState.project_data.body;
          project_name.value = selectedState.project_data.name;
        } else {
          clear_editor();
          console.error("Selected project not found");
        }
        loaded_id.value = selectedId;
      }
    } catch (error) {
      handleError("Error al seleccionar el proyecto", error);
    }
    status.value = "READY";
  }

  /**
   * Asincrónicamente elimina un proyecto de la base de datos y borra el editor si la operación es exitosa.
   *
   * @return {Promise<void>} Una promesa que se resuelve cuando el proyecto se elimina correctamente,
   *                          o rechaza con un error si la eliminación falla.
   */
  async function delete_project() {
    if (window.confirm("¿Eliminar proyecto?")) {
      try {
        await db.projects.delete(loaded_id.value);
        clear_editor();
      } catch (error) {
        handleError("Error al eliminar el proyecto", error);
      }
    }
  }

  /**
   * Automatically saves the project if the project name is not empty and the status is 'READY'.
   *
   * @return {void} This function does not return a value.
   */
  function auto_save() {
    if (project_name.value === "") return;
    if (status.value !== "READY") return;
    update_project();
  }

  /**
   * Asincrónicamente exporta la base de datos a un archivo JSON.
   *
   * @param {string} filename - El nombre del archivo al cual se exportará la base de datos.
   * @return {Promise<Blob>} Una promesa que se resuelve con la base de datos exportada como un Blob.
   * @throws {Error} Si hay un error mientras se exporta la base de datos.
   */
  async function export_database(filename) {
    try {
      await db.open();
      const blob = await exportDB(db);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${filename || file_name.value}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('Base de datos exportada');
      return blob;
    } catch (error) {
      toast.error('Error al exportar la base de datos');
      handleError("Error al exportar la base de datos", error);
    }
  }

  async function share_database() {
    try {
      await db.open();
      const blob = await exportDB(db);
      const reader = new FileReader();
      reader.onloadend = () => {
        const text = reader.result;
        const json = JSON.parse(text);
        shareOptions.value = JSON.stringify(json, null, 2);
      };
      reader.readAsText(blob);
    } catch (error) {
      handleError("Error al exportar la base de datos", error);
    }
  }

  /**
   * Asynchronously imports a database from a file. If DB name already exists, the user is prompted to confirm
   * whether they want to replace the existing database with the new information. If the confirmation is given, the
   * existing database is cleared, the new file is imported into the database, the search term is cleared, the database
   * is updated with the new file name, and the editor is cleared. If there is an error during the import process, an
   * error message is displayed.
   *
   * @param {File} file - The file containing the database to import.
   * @return {Promise<void>} A promise that resolves when the import is complete.
   */
  async function import_database(file) {
    // check if file is a json file

    const replace_file_name = file.name.replace(".json", "");
    const confirmationMessage = file_name.value
      ? `¿Desea reemplazar la DB ${file_name.value} con la información de ${replace_file_name}?`
      : `¿Desea reemplazar la DB con la información de ${replace_file_name}?`;
    if (window.confirm(confirmationMessage)) {
      try {
        await clearDatabase();
        await importInto(db, file, {});
        update_database(replace_file_name);
        showImportModal.value = false
        clear_editor();
        searchTerm.value = "";
        toast.success('Base de datos importada', {
          style: {
            background: "#ecfdf3",
            color: "#008a2e"
          },
          class: 'my-toast',
          descriptionClass: 'my-toast-description'
        })
        
      } catch (error) {
        toast.error('Error al importar la base de datos')
        handleError("Error al importar la base de datos", error);
      }
    } else {
      console.log("Import cancel");
      toast.warning('Importación cancelada')
    }
  }

  /**
   * Asynchronously clears the database by removing all records from the
   * 'projects' and 'file' tables. This function does not take any parameters
   * and does not return any values.
   *
   * @return {Promise<void>} A promise that resolves when the database is cleared.
   */
  async function clearDatabase() {
    await db.projects.clear();
    await db.file.clear();
  }

  /**
   * Sets the database by checking the count of files in the database.
   * If the count is 0, adds a new file with the current date and the value of file_name.
   * If the count is 1, retrieves the selected state and sets the value of file_name to the name of the selected state.
   * If an error occurs, calls the handleError function with the appropriate error message.
   *
   * @return {Promise<void>} A promise that resolves when the database is set.
   */
  async function init_database() {
    try {
      const count = await db.file.count();
      if (count === 0) {
        await db.file.add({
          date: new Date().toISOString(),
          name: file_name.value,
        });
      } else if (count === 1) {
        const selectedState = await db.file.get(1);
        if (selectedState) file_name.value = selectedState.name;
      }
    } catch (error) {
      handleError("Error al configurar la base de datos", error);
    }
  }

  /**
   * Updates the database with a new name.
   *
   * @param {string} name - The new name to update the database with.
   * @return {Promise<void>} - A Promise that resolves when the database is updated successfully.
   * @throws {Error} - If there is an error updating the database, an error is thrown with a message indicating the error.
   */
  async function update_database(name) {
    try {
      file_name.value = name;
      await db.file.update(1, {
        date: new Date().toISOString(),
        name,
      });
    } catch (error) {
      handleError("Error al actualizar la base de datos", error);
    }
  }

  /**
   * Handles an error by logging the error message and updating the status value.
   *
   * @param {string} message - The error message to be logged.
   * @param {Error} error - The error object to be logged.
   */
  function handleError(message, error) {
    console.error(message, error);
    status.value = "ERROR";
  }

  const allItems = useObservable(liveQuery(() => db.projects.toArray()));

  return {
    loaded_id,
    file_name,
    project_body,
    project_name,
    searchTerm,
    status,
    allItems,
    showProjects,
    shareOptions,
    init_database,
    update_database,
    import_database,
    export_database,
    share_database,
    set_project,
    create_project,
    update_project,
    delete_project,
    auto_save,
    clear_editor,
    showImportModal
  };
});
