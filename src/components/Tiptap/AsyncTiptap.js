import { defineAsyncComponent } from "vue";
import Loading from "./Loading.vue";
import Error from "./Error.vue";

export const Editor = defineAsyncComponent({
  loader: () => import("./EditorTipTap.vue"),
  loadingComponent: Loading,
  errorComponent: Error
});
