import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

function DriverJsInit() {

  const productTourSeen = localStorage.getItem('product_tour_seen') === 'true';

  if (productTourSeen) { return; }

  const driverObj = driver({
    allowClose: false,
    nextBtnText: 'Siguiente',
    prevBtnText: 'Anterior',
    doneBtnText: 'Comenzar',
    popoverClass: 'driverjs-theme',
    progressText: '{{current}} de {{total}}',
    showProgress: true,
    steps: [
      {
        popover: {
          title: 'Holis 👋',
          description: 'Te guiaremos en un pequeño recorrido. Podés navegar utilizando las flechas del teclado.',
        }
      },
      {
        element: '.DataBaseTitle',
        popover: {
          title: 'Nombre del proyecto',
          description: 'Aquí podrás editar el nombre de la base de datos (DB) local.',
          side: 'bottom',
          align: 'center'
        }
      },

      {
        element: '.create_project',
        popover: {
          title: 'Título del documento',
          description: 'En este campo puedes establecer el título de cada documento.',
          side: 'bottom',
          align: 'center'
        },
      },
      {
        element: '.EditorCK',
        popover: {
          title: 'Editor de texto',
          description: 'Aquí podrás añadir texto enriquecido, bloques de código bonitos para 295 lenguajes, imágenes y videos de YouTube.',
          side: 'top',
          align: 'center'
        }
      },
      {
        element: '.GuardarDocumento',
        popover: {
          title: 'Agregar documento',
          description: 'Se crea el documento en la DB. Una vez creado los cambios se guardarán automaticamente.',
          side: 'top',
          align: 'center'
        }
      },
      {
        element: '.ToggleEditable',
        popover: {
          title: 'Vista previa',
          description: 'Alterna entre la vista de edición y la vista previa del documento.',
          side: 'bottom',
          align: 'center'
        }
      },
      {
        element: '.SidebarBottom',
        popover: {
          title: 'Importar y exportar',
          description: 'Guarda la base de datos en formato JSON para importarla en otro navegador.',
          side: 'top',
          align: 'center'
        }
      },
      {
        popover: {
          title: '¡Listo!',
          description: '¡Disfruta de la experiencia!',
        }
      }
    ],

    onDestroyed: () => {
      localStorage.setItem('product_tour_seen', 'true');
    }
  });

  driverObj.drive();
}


export default DriverJsInit