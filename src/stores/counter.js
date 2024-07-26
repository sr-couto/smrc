import { ref } from 'vue'
import { defineStore } from 'pinia'
import { db } from '@/db'
import { liveQuery } from 'dexie'
import { useObservable } from '@vueuse/rxjs'
import { project_data } from '@/data'
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

  function autoSave() {
    if (project_name.value === '') return;
    if (status.value !== 'READY') return;
    updateProject()
  }

  async function updateProject() {
    try {
      await db.projects.update(loaded_id.value, {
        date: new Date().toISOString(),
        project_data: {
          body: project_body.value,
          name: project_name.value
        }
      });
    } catch (error) {
      console.error('Error al crear el proyecto', error)
      status.value = 'ERROR';
    }
  }

  async function setProject(id) {
    const selectedId = id ? parseInt(id, 10) : null;
    if (selectedId !== loaded_id.value) {
      status.value = 'CHANGING';
      if (selectedId === null) {
        // No invoice selected, reset to initial state
        form_data.value = structuredClone(project_data);
      } else {
        const selectedState = await db.projects.get(selectedId);
        if (selectedState) {
          form_data.value = selectedState.formState
          project_body.value = selectedState.project_data.body
          project_name.value = selectedState.project_data.name
        } else {
          console.error('Selected invoice not found');
          form_data.value = structuredClone(project_data);
        }
      }
      loaded_id.value = selectedId;
      status.value = 'READY';
    }
  }

  async function deleteProject() {
    const confirm = window.confirm('¿Eliminar proyecto?');
    if (confirm) {
      await db.projects.delete(loaded_id.value)
      new_project()
    }
  }

  async function export_data() {
    try {
      const all_invoices_export = await db.projects.toArray()
      const json_string = JSON.stringify(all_invoices_export, null, 2)
      const blob = new Blob([json_string], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'archivo.json'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error(error)
    }
  }

  const items = useObservable(liveQuery(() => db.projects.toArray()))

  return {
    save,
    status,
    loaded_id,
    items,
    project_name,
    project_body,
    setProject,
    new_project,
    deleteProject,
    updateProject,
    autoSave,
    export_data
  }
})
