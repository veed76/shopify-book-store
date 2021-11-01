import React from 'react';
import ReactDOM from 'react-dom';
import {AppProvider, Frame} from "@shopify/polaris";
import enTranslations from '@shopify/polaris/locales/en.json';
import  Create  from "./Product/Create";
import  List from "./Product/List";
import { BrowserRouter as  Router, Switch, Route, Link, matchPath } from "react-router-dom";
import AppRoutes from "./routes";
function App() {

    const currentRoute = AppRoutes.find((route) =>
        matchPath(location.pathname, route)
    );
    return (
        <AppProvider
            i18n={enTranslations}
        >
            <Frame>
            <Router>
                <ul role="tablist" className="Polaris-Tabs">
                    {AppRoutes.map((route, i) => {
                        return (
                            <li
                                className="Polaris-Tabs__TabContainer"
                                key={i}
                            >
                                <Link to={route.path}>
                                    <button
                                        role="tab"
                                        type="button"
                                        className={`Polaris-Tabs__Tab ${
                                            currentRoute.path ===
                                            route.path
                                                ? "Polaris-Tabs__Tab--selected"
                                                : ""
                                        }`}
                                    >
                                        <span className="Polaris-Tabs__Title Polaris-Tabs--newDesignLanguage">
                                            {route.page.title}
                                        </span>
                                    </button>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
                <Switch>
                    <Route exact path="/">
                        <List />
                    </Route>
                    <Route path="/create">
                        <Create />
                    </Route>
                </Switch>
            </Router>
            </Frame>
        </AppProvider>
    );
}

export default App;

ReactDOM.render(<App />, document.getElementById('app'));

