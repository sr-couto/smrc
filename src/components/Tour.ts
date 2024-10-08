import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

function DriverJsInit() {

  const productTourSeen = localStorage.getItem('product_tour_seen') === 'true';

  if (productTourSeen) { return; }

  const driverObj = driver({
    animate: false,
    nextBtnText: 'Siguiente',
    prevBtnText: 'Anterior',
    doneBtnText: 'Comenzar',
    popoverClass: 'driverjs-theme',
    showProgress: true,
    steps: [
      {
        popover: {
          title: 'Bienvenido',
          description: 'Vamos a tomar un pequeño paseo para ver como utilizar esta App para crear documentos.',
        }
      },
      {
        element: '.DataBaseTitle',
        popover: {
          title: 'Nombre proyecto',
          description: 'Aqui podras editar el nombre de la base de datos.',
          side: 'bottom',
          align: 'center'
        }
      },
      
      {
        element: '.CreateNewButton',
        popover: {
          title: 'Nuevo documento',
          description: 'Creá todos los documentos que quieras.',
          side: 'bottom',
          align: 'center'
        }
      },
      {
        element: '.BottomToolbar',
        popover: {
          title: 'Importar y Exportar',
          description: 'Puedes exportar el proyecto y guardarlo localmente para luego importarlos',
          side: 'top',
          align: 'center'
        }
      },
      {
        element: '.create_project',
        popover: {
          title: 'Ingresar titulo',
          description: 'Este campo permite editar el titulo de cada documento.',
          side: 'bottom',
          align: 'center'
        },
      },
      {
        element: '.EditorCK',
        popover: {
          title: 'Editor de texto',
          description: 'Aqui podra agregar texto, imágenes y videos de youtube',
          side: 'top',
          align: 'center'
        }
      },
      {
        element: '.GuardarDocumento',
        popover: {
          title: 'Guardar',
          description: 'Para que los cambios se guarden y se cree un nuevo documento',
          side: 'top',
          align: 'center'
        }
      },

      {
        element: '.ToggleEditable',
        popover: {
          title: 'Previsualización',
          description: 'Puedes alternar entre vista previa y vista editada',
          side: 'left',
          align: 'center'
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