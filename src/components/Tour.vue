<script setup>
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { onMounted } from "vue";
import {
  breakpointsTailwind,
  useBreakpoints,
} from "@vueuse/core";
const breakpoints = useBreakpoints(breakpointsTailwind);
const largerThanLg = breakpoints.greater("lg");

onMounted(() => {
  if (largerThanLg.value === true) {
    driverJsInit();
  }
});

function driverJsInit() {

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


</script>

<style>
.driver-popover.driverjs-theme {
  @apply bg-secondary text-foreground
}

.driver-popover.driverjs-theme .driver-popover-title {
  font-size: 20px;
}

.driver-popover.driverjs-theme .driver-popover-title,
.driver-popover.driverjs-theme .driver-popover-description,
.driver-popover.driverjs-theme .driver-popover-progress-text {
  @apply text-foreground font-mono text-xs
}

.driver-popover.driverjs-theme button {
  @apply focus-within:ring-2 bg-secondary text-foreground border-secondary font-mono;
  text-align: center;
  text-shadow: none;
}

.driver-popover.driverjs-theme button:hover {
  @apply bg-primary text-primary-foreground
}

.driver-popover.driverjs-theme .driver-popover-navigation-btns {
  justify-content: space-end;
  align-items: center;
  gap: 3px;
}

.driver-popover.driverjs-theme .driver-popover-close-btn {
  @apply text-foreground outline-none border-0 focus-within:!ring-1 hover:bg-background
}

.driver-popover.driverjs-theme .driver-popover-close-btn:hover {
  @apply text-muted-foreground
}

.driver-popover.driverjs-theme .driver-popover-arrow-side-left.driver-popover-arrow {
  border-left-color: hsl(var(--secondary));
}

.driver-popover.driverjs-theme .driver-popover-arrow-side-right.driver-popover-arrow {
  border-right-color: hsl(var(--secondary));
}

.driver-popover.driverjs-theme .driver-popover-arrow-side-top.driver-popover-arrow {
  border-top-color: hsl(var(--secondary));
}

.driver-popover.driverjs-theme .driver-popover-arrow-side-bottom.driver-popover-arrow {
  border-bottom-color: hsl(var(--secondary));
}
</style>