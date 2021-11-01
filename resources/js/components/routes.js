import List from "./Product/List";
import Create from "./Product/Create";
const routes = [
    {
        path: '/',
        exact: true,
        page: {
            component: List,
            title: "Home Page",
        },
    },

];

export default routes;
