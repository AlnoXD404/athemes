import TransferListener from '@/components/server/TransferListener';
import React, { useEffect, useState } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt, faLayerGroup, faUserCog } from '@fortawesome/free-solid-svg-icons';
import tw from 'twin.macro';
import Sidebar from '@/components/Sidebar';
import TransitionRouter from '@/TransitionRouter';
import WebsocketHandler from '@/components/server/WebsocketHandler';
import { ServerContext } from '@/state/server';
import Can from '@/components/elements/Can';
import Spinner from '@/components/elements/Spinner';
import { NotFound, ServerError } from '@/components/elements/ScreenBlock';
import { httpErrorToHuman } from '@/api/http';
import { useStoreState } from 'easy-peasy';
import InstallListener from '@/components/server/InstallListener';
import ErrorBoundary from '@/components/elements/ErrorBoundary';
import { useLocation } from 'react-router';
import ConflictStateRenderer from '@/components/server/ConflictStateRenderer';
import PermissionRoute from '@/components/elements/PermissionRoute';
import routes from '@/routers/routes';

export default () => {
    const match = useRouteMatch<{ id: string }>();
    const location = useLocation();

    const rootAdmin = useStoreState((state) => state.user.data!.rootAdmin);
    const [error, setError] = useState('');

    const id = ServerContext.useStoreState((state) => state.server.data?.id);
    const uuid = ServerContext.useStoreState((state) => state.server.data?.uuid);
    const serverName = ServerContext.useStoreState((state) => state.server.data?.name);
    const inConflictState = ServerContext.useStoreState((state) => state.server.inConflictState);
    const serverId = ServerContext.useStoreState((state) => state.server.data?.internalId);
    const getServer = ServerContext.useStoreActions((actions) => actions.server.getServer);
    const clearServerState = ServerContext.useStoreActions((actions) => actions.clearServerState);

    const to = (value: string, url = false) => {
        if (value === '/') {
            return url ? match.url : match.path;
        }
        return `${(url ? match.url : match.path).replace(/\/*$/, '')}/${value.replace(/^\/+/, '')}`;
    };

    useEffect(
        () => () => {
            clearServerState();
        },
        []
    );

    useEffect(() => {
        setError('');

        getServer(match.params.id).catch((error) => {
            console.error(error);
            setError(httpErrorToHuman(error));
        });

        return () => {
            clearServerState();
        };
    }, [match.params.id]);

    return (
        <React.Fragment key={'server-router'}>
            <div css={tw`flex min-h-screen`}>
                <Sidebar hideAccount={!!uuid && !!id} hideSearch>
                    <Sidebar.Link to={'/'} exact>
                        <FontAwesomeIcon icon={faLayerGroup} css={tw`w-5 h-5`} />
                        Dashboard
                    </Sidebar.Link>
                    {!!uuid && !!id ? (
                        <>
                            <Sidebar.Label>{serverName || 'Server'}</Sidebar.Label>
                            {routes.server
                                .filter((route) => !!route.name)
                                .map((route) =>
                                    route.permission ? (
                                        <Can key={route.path} action={route.permission} matchAny>
                                            <Sidebar.DropdownLink to={to(route.path, true)} exact={route.exact}>
                                                {route.icon && <FontAwesomeIcon icon={route.icon} css={tw`w-5 h-5 flex-shrink-0`} />}
                                                {route.name}
                                            </Sidebar.DropdownLink>
                                        </Can>
                                    ) : (
                                        <Sidebar.DropdownLink key={route.path} to={to(route.path, true)} exact={route.exact}>
                                            {route.icon && <FontAwesomeIcon icon={route.icon} css={tw`w-5 h-5 flex-shrink-0`} />}
                                            {route.name}
                                        </Sidebar.DropdownLink>
                                    )
                                )}
                            {rootAdmin && (
                                <Sidebar.DropdownExternalLink href={`/admin/servers/view/${serverId}`} target={'_blank'} rel={'noreferrer'}>
                                    <FontAwesomeIcon icon={faExternalLinkAlt} css={tw`w-5 h-5 flex-shrink-0`} />
                                    Admin View
                                </Sidebar.DropdownExternalLink>
                            )}
                        </>
                    ) : (
                        <Sidebar.Section title={'Account'} icon={faUserCog} to={'/account'}>
                            {routes.account
                                .filter((route) => !!route.name)
                                .map(({ path, name, icon, exact = false }) => (
                                    <Sidebar.DropdownLink key={path} to={`/account/${path}`.replace('//', '/')} exact={exact}>
                                        {icon && <FontAwesomeIcon icon={icon} css={tw`w-5 h-5 flex-shrink-0`} />}
                                        {name}
                                    </Sidebar.DropdownLink>
                                ))}
                        </Sidebar.Section>
                    )}
                </Sidebar>
                <main css={tw`flex-1 min-w-0 p-4 md:p-6`}>
                    {!uuid || !id ? (
                        error ? (
                            <ServerError message={error} />
                        ) : (
                            <Spinner size={'large'} centered />
                        )
                    ) : (
                        <>
                            <InstallListener />
                            <TransferListener />
                            <WebsocketHandler />
                            {inConflictState && (!rootAdmin || (rootAdmin && !location.pathname.endsWith(`/server/${id}`))) ? (
                                <ConflictStateRenderer />
                            ) : (
                                <ErrorBoundary>
                                    <TransitionRouter>
                                        <Switch location={location}>
                                            {routes.server.map(({ path, permission, component: Component }) => (
                                                <PermissionRoute key={path} permission={permission} path={to(path)} exact>
                                                    <Spinner.Suspense>
                                                        <Component />
                                                    </Spinner.Suspense>
                                                </PermissionRoute>
                                            ))}
                                            <Route path={'*'} component={NotFound} />
                                        </Switch>
                                    </TransitionRouter>
                                </ErrorBoundary>
                            )}
                        </>
                    )}
                </main>
            </div>
        </React.Fragment>
    );
};