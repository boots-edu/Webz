import { WebzComponent } from "./WebzComponent";

declare const window: Window;

/**
 * @description: A route
 * @export
 * @interface Route
 * @group Routing
 * @member path - the path of the route
 * @member component - the component to render (instance of WebzComponent)
 */
export interface Route {
    path: string;
    component: WebzComponent;
}
declare const URLHREF: string;

export class WebzRouter {
    private baseRoute: string = URLHREF || "";
    private currentComponent: WebzComponent | null = null;
    private selectedPage: number = 0;
    constructor(
        private container: WebzComponent,
        private routes: Route[],
        private id: string,
    ) {
        this.route(window.location.pathname.replace(this.baseRoute, ""));
    }

    selectedRoute(): number {
        return this.selectedPage;
    }
    route(path: string) {
        const route = this.routes.find((r) => r.path === path);
        if (route) {
            this.selectedPage = this.routes.indexOf(route);

            if (this.currentComponent)
                this.container["removeComponent"](this.currentComponent);
            this.currentComponent = route.component;
            if (this.id === "root") {
                this.container.addComponent(route.component);
            } else {
                this.container.addComponent(route.component, this.id);
            }
            window.history.pushState({}, "", this.baseRoute + path);
        }
    }
}
