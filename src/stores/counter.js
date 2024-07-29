import { ref } from 'vue'
import { defineStore } from 'pinia'
import { db } from '@/db'
import { liveQuery } from 'dexie'
import { useObservable } from '@vueuse/rxjs'
// import { project_data } from '@/data'
import { exportDB, importInto } from "dexie-export-import";

export const useCounterStore = defineStore('counter', () => {
  const status = ref('LOADING')
  const loaded_id = ref(null)
  const file_name = ref('Proyectos')
  const project_name = ref('')
  const project_body = ref('')
  const searchTerm = ref('')

  function clear_editor() {
    loaded_id.value = null
    project_name.value = ''
    project_body.value = ''
  }

  async function create_project() {
    try {
      status.value = 'CHANGING';
      const new_project_id = await db.projects.add({
        date: new Date().toISOString(),
        createAd: new Date().toISOString(),
        project_data: {
          body: project_body.value,
          name: project_name.value
        }
      })
      loaded_id.value = new_project_id
      status.value = 'READY';
    } catch (error) {
      console.error('Error al crear el proyecto', error)
      status.value = 'ERROR';
    }
  }

  async function update_project() {
    try {
      await db.projects.update(loaded_id.value, {
        date: new Date().toISOString(),
        project_data: {
          body: project_body.value,
          name: project_name.value
        }
      });
    } catch (error) {
      console.error('Error al actualizar el proyecto', error)
      status.value = 'ERROR';
    }
  }

  async function set_project(id) {
    const selectedId = id ? parseInt(id, 10) : null;
    if (selectedId === loaded_id.value) {
      return;
    }
    status.value = 'CHANGING';
    if (selectedId === null) {
      project_body.value = "";
      project_name.value = "";
      loaded_id.value = selectedId;
      status.value = 'READY';
      return;
    }
    const selectedState = await db.projects.get(selectedId);
    if (selectedState) {
      project_body.value = selectedState.project_data.body;
      project_name.value = selectedState.project_data.name;
    } else {
      console.error('Selected invoice not found');
      project_body.value = "";
      project_name.value = "";
    }
    loaded_id.value = selectedId;
    status.value = 'READY';
  }

  async function delete_project() {
    const confirm = window.confirm('¿Eliminar proyecto?');
    if (confirm) {
      await db.projects.delete(loaded_id.value)
      clear_editor()
    }
  }

  function auto_save() {
    if (project_name.value === '') return;
    if (status.value !== 'READY') return;
    update_project()
  }

  async function export_database(filename) {
    await db.open();
    const blob = await exportDB(db);
    try {
      const date = new Date();
      const isoString = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}-${String(date.getHours()).padStart(2, '0')}${String(date.getMinutes()).padStart(2, '0')}${String(date.getSeconds()).padStart(2, '0')}`;
      console.log(isoString);
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      if (filename) {
        link.download = `${filename}-${isoString}.json`
      } else {
        link.download = `${file_name.value}-${isoString}.json`
      }
      console.log(link.download)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error(error)
    }
    return blob;
  }

  async function import_database(file) {
    const confirm = window.confirm('¿Desea reemplazar la base?');
    console.log(file.name)
    const replace_file_name = file.name.replace('.json', '');
    console.log(replace_file_name)
    if (confirm) {
      await db.projects.clear()
      await importInto(db, file, {});
      searchTerm.value = ""
      file_name.value = replace_file_name
      clear_editor()
    }
    return
  }

  const allItems = useObservable(liveQuery(() => db.projects.toArray()))

  return {
    auto_save,
    clear_editor,
    set_project,
    create_project,
    update_project,
    delete_project,
    export_database,
    import_database,
    allItems,
    loaded_id,
    file_name,
    project_body,
    project_name,
    searchTerm,
    status,
  }
})
