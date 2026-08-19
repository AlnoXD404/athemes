import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLayerGroup, faUserCog } from '@fortawesome/free-solid-svg-icons';
import tw from 'twin.macro';
import Sidebar from '@/components/Sidebar';
import DashboardContainer from '@/components/dashboard/DashboardContainer';
import { NotFound } from '@/components/elements/ScreenBlock';
import TransitionRouter from '@/TransitionRouter';
import { useLocation } from 'react-router';
import Spinner from '@/components/elements/Spinner';
import routes from '@/routers/routes';

export default () => {
    const location = useLocation();

    return (
        <div css={tw`flex min-h-screen`}>
            <Sidebar>
                <Sidebar.Link to={'/'} exact>
                    <FontAwesomeIcon icon={faLayerGroup} css={tw`mr-3 w-4`} />
                    Dashboard
                </Sidebar.Link>
                <Sidebar.Section title={'Account'} icon={faUserCog} to={'/account'}>
                    {routes.account
                        .filter((route) => !!route.name)
                        .map(({ path, name, exact = false }) => (
                            <Sidebar.DropdownLink key={path} to={`/account/${path}`.replace('//', '/')} exact={exact}>
                                {name}
                            </Sidebar.DropdownLink>
                        ))}
                </Sidebar.Section>
            </Sidebar>
            <main css={tw`flex-1 min-w-0 p-4 md:p-6`}>
                <TransitionRouter>
                    <React.Suspense fallback={<Spinner centered />}>
                        <Switch location={location}>
                            <Route path={'/'} exact>
                                <DashboardContainer />
                            </Route>
                            {routes.account.map(({ path, component: Component }) => (
                                <Route key={path} path={`/account/${path}`.replace('//', '/')} exact>
                                    <Component />
                                </Route>
                            ))}
                            <Route path={'*'}>
                                <NotFound />
                            </Route>
                        </Switch>
                    </React.Suspense>
                </TransitionRouter>
            </main>
        </div>
    );
};