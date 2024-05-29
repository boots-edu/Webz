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

/**
 * @description: A router
 * @export
 * @class WebzRouter
 * @group Routing
 */
export class WebzRouter {
    private baseRoute: string = URLHREF || "";
    private currentComponent: WebzComponent | null = null;
    private selectedPage: number = 0;
    /**
     * Creates an instance of WebzRouter.
     * @param {WebzComponent} container - the container component
     * @param {Route[]} routes - the routes
     * @param {string} id - the id to place the routed content
     * @memberof WebzRouter
     * @group Routing
     * @example
     * const router = new WebzRouter(container, [
     *  { path: "/", component: new Home() },
     *  { path: "/about", component: new About() },
     *  { path: "/contact", component: new Contact() },
     *  ], "content");
     */
    constructor(
        private container: WebzComponent,
        private routes: Route[],
        private id: string,
    ) {
        this.route(window.location.pathname.replace(this.baseRoute, ""));
    }

    /**
     * @description: Gets the selected route
     * @memberof WebzRouter
     * @group Routing
     * @returns {number} - the selected route
     */
    selectedRoute(): number {
        return this.selectedPage;
    }
    /**
     * @description: Routes to a path
     * @memberof WebzRouter
     * @group Routing
     * @param {string} path - the path to route to
     * @example
     * const router = new WebzRouter(container, [
     *  { path: "/", component: new Home() },
     *  { path: "/about", component: new About() },
     *  { path: "/contact", component: new Contact() },
     *  ], "content");
     * router.route("/about");
     */
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
