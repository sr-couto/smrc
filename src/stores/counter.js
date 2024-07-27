import { ref } from 'vue'
import { defineStore } from 'pinia'
import { db } from '@/db'
import { liveQuery } from 'dexie'
import { useObservable } from '@vueuse/rxjs'
import { project_data } from '@/data'
import { exportDB, importInto } from "dexie-export-import";

export const useCounterStore = defineStore('counter', () => {
  const status = ref('LOADING')
  const loaded_id = ref(null)
  const project_name = ref('')
  const project_body = ref('')
  const form_data = ref(structuredClone(project_data));

  function new_project() {
    loaded_id.value = null
    form_data.value = [
      project_data
    ]
    project_name.value = ''
    project_body.value = ''
  }

  async function save() {
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

  function auto_save() {
    if (project_name.value === '') return;
    if (status.value !== 'READY') return;
    update_project()
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

  // async function set_project(id) {
  //   const selectedId = id ? parseInt(id, 10) : null;
  //   if (selectedId !== loaded_id.value) {
  //     status.value = 'CHANGING';
  //     if (selectedId === null) {
  //       form_data.value = structuredClone(project_data);
  //     } else {
  //       const selectedState = await db.projects.get(selectedId);
  //       if (selectedState) {
  //         form_data.value = selectedState.formState
  //         project_body.value = selectedState.project_data.body
  //         project_name.value = selectedState.project_data.name
  //       } else {
  //         console.error('Selected invoice not found');
  //         form_data.value = structuredClone(project_data);
  //       }
  //     }
  //     loaded_id.value = selectedId;
  //     status.value = 'READY';
  //   }
  // }

  async function set_project(id) {
    const selectedId = id ? parseInt(id, 10) : null;

    if (selectedId === loaded_id.value) {
      return;
    }

    status.value = 'CHANGING';

    if (selectedId === null) {
      form_data.value = structuredClone(project_data);
      loaded_id.value = selectedId;
      status.value = 'READY';
      return;
    }

    const selectedState = await db.projects.get(selectedId);

    if (selectedState) {
      form_data.value = selectedState.formState;
      project_body.value = selectedState.project_data.body;
      project_name.value = selectedState.project_data.name;
    } else {
      console.error('Selected invoice not found');
      form_data.value = structuredClone(project_data);
    }

    loaded_id.value = selectedId;
    status.value = 'READY';
  }

  async function delete_project() {
    const confirm = window.confirm('¿Eliminar proyecto?');
    if (confirm) {
      await db.projects.delete(loaded_id.value)
      new_project()
    }
  }

  async function exportDatabase(filename) {
    console.log(filename)
    await db.open();
    const blob = await exportDB(db);
    try {
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      if (filename) {
        link.download = `${filename}.json`
      } else {
        link.download = `backup-${new Date().toISOString()}.json`
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


  async function importDatabase(file) {
    const confirm = window.confirm('¿Desea reemplazar la base?');
    if (confirm) {
      await db.projects.clear()
      await importInto(db, file, {});
      return db.backendDB();
    }
  }

  const items = useObservable(liveQuery(() => db.projects.toArray()))

  return {
    auto_save,
    delete_project,
    exportDatabase,
    importDatabase,
    items,
    loaded_id,
    new_project,
    project_body,
    project_name,
    save,
    set_project,
    status,
    update_project
  }
})
