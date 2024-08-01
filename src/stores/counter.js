import { ref } from 'vue';
import { defineStore } from 'pinia';
import { db } from '@/db';
import { liveQuery } from 'dexie';
import { useObservable } from '@vueuse/rxjs';
import { exportDB, importInto } from 'dexie-export-import';

export const useCounterStore = defineStore('counter', () => {
  const status = ref('LOADING');
  const loaded_id = ref(null);
  const file_name = ref('');
  const project_name = ref('');
  const project_body = ref('');
  const searchTerm = ref('');
  const showProjects = ref(true);

  function clear_editor() {
    loaded_id.value = null;
    project_name.value = '';
    project_body.value = '';
  }

  async function create_project() {
    try {
      status.value = 'CHANGING';
      const new_project_id = await db.projects.add({
        date: new Date().toISOString(),
        createAd: new Date().toISOString(),
        project_data: {
          body: project_body.value,
          name: project_name.value,
        },
      });
      loaded_id.value = new_project_id;
      status.value = 'READY';
    } catch (error) {
      handleError('Error al crear el proyecto', error);
    }
  }

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
      handleError('Error al actualizar el proyecto', error);
    }
  }

  async function set_project(id) {
    const selectedId = id ? parseInt(id, 10) : null;
    if (selectedId === loaded_id.value) return;
    status.value = 'CHANGING';
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
          console.error('Selected project not found');
        }
        loaded_id.value = selectedId;
      }
    } catch (error) {
      handleError('Error al seleccionar el proyecto', error);
    }
    status.value = 'READY';
  }

  async function delete_project() {
    if (window.confirm('¿Eliminar proyecto?')) {
      try {
        await db.projects.delete(loaded_id.value);
        clear_editor();
      } catch (error) {
        handleError('Error al eliminar el proyecto', error);
      }
    }
  }

  function auto_save() {
    if (project_name.value === '') return;
    if (status.value !== 'READY') return;
    update_project()
  }

  async function export_database(filename) {
    try {
      await db.open();
      const blob = await exportDB(db);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename || file_name.value}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      return blob;
    } catch (error) {
      handleError('Error al exportar la base de datos', error);
    }
  }

  async function import_database(file) {
    const replace_file_name = file.name.replace('.json', '');
    const confirmationMessage = file_name.value
      ? `¿Desea reemplazar la DB ${file_name.value} con la información de ${replace_file_name}?`
      : `¿Desea reemplazar la DB con la información de ${replace_file_name}?`;
    if (window.confirm(confirmationMessage)) {
      try {
        await clearDatabase();
        await importInto(db, file, {});
        searchTerm.value = '';
        update_database(replace_file_name);
        clear_editor();
      } catch (error) {
        handleError('Error al importar la base de datos', error);
      }
    }
  }

  async function clearDatabase() {
    await db.projects.clear();
    await db.file.clear();
  }

  async function set_database() {
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
      handleError('Error al configurar la base de datos', error);
    }
  }

  async function update_database(name) {
    try {
      file_name.value = name;
      await db.file.update(1, {
        date: new Date().toISOString(),
        name,
      });
    } catch (error) {
      handleError('Error al actualizar la base de datos', error);
    }
  }

  function handleError(message, error) {
    console.error(message, error);
    status.value = 'ERROR';
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
    set_database,
    update_database,
    export_database,
    import_database,
    set_project,
    create_project,
    update_project,
    delete_project,
    auto_save,
    clear_editor,
  };
});
