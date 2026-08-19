import React, { memo } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { ServerContext } from '@/state/server';
import Can from '@/components/elements/Can';
import ServerContentBlock from '@/components/elements/ServerContentBlock';
import isEqual from 'react-fast-compare';
import Spinner from '@/components/elements/Spinner';
import Features from '@feature/Features';
import Console from '@/components/server/console/Console';
import StatGraphs from '@/components/server/console/StatGraphs';
import PowerButtons from '@/components/server/console/PowerButtons';
import ServerDetailsBlock from '@/components/server/console/ServerDetailsBlock';
import { Alert } from '@/components/elements/alert';

export type PowerAction = 'start' | 'stop' | 'restart' | 'kill';

const ServerConsoleContainer = () => {
    const name = ServerContext.useStoreState((state) => state.server.data!.name);
    const description = ServerContext.useStoreState((state) => state.server.data!.description);
    const isInstalling = ServerContext.useStoreState((state) => state.server.isInstalling);
    const isTransferring = ServerContext.useStoreState((state) => state.server.data!.isTransferring);
    const eggFeatures = ServerContext.useStoreState((state) => state.server.data!.eggFeatures, isEqual);
    const isNodeUnderMaintenance = ServerContext.useStoreState((state) => state.server.data!.isNodeUnderMaintenance);
    const match = useRouteMatch<{ id: string }>();

    return (
        <ServerContentBlock title={'Console'}>
            {(isNodeUnderMaintenance || isInstalling || isTransferring) && (
                <Alert type={'warning'} className={'mb-4'}>
                    {isNodeUnderMaintenance
                        ? 'The node of this server is currently under maintenance and all actions are unavailable.'
                        : isInstalling
                        ? 'This server is currently running its installation process and most actions are unavailable.'
                        : 'This server is currently being transferred to another node and all actions are unavailable.'}
                </Alert>
            )}
            <div className={'grid grid-cols-4 gap-4 mb-4'}>
                <div className={'hidden sm:block sm:col-span-2 lg:col-span-3 pr-4'}>
                    <h1 className={'font-header font-medium text-2xl text-gray-50 leading-relaxed line-clamp-1'}>
                        {name}
                    </h1>
                    <p className={'text-sm line-clamp-2'}>{description}</p>
                </div>
                <div className={'col-span-4 sm:col-span-2 lg:col-span-1 self-end'}>
                    <div className={'flex flex-col sm:flex-row sm:justify-end items-stretch sm:items-center gap-2'}>
                        <Can action={['control.start', 'control.stop', 'control.restart']} matchAny>
                            <PowerButtons className={'flex flex-1 space-x-2'} />
                        </Can>
                        <a
                            href={`${match.url}/files`}
                            className={
                                'inline-flex items-center justify-center flex-1 rounded p-2 uppercase tracking-wide text-sm border border-primary-600 bg-primary-500 text-primary-50 no-underline transition-all duration-150 hover:bg-primary-600 hover:border-primary-700'
                            }
                        >
                            SFTP
                        </a>
                    </div>
                </div>
            </div>
            <div className={'mb-4'}>
                <ServerDetailsBlock />
            </div>
            <div className={'mb-4'}>
                <Spinner.Suspense>
                    <Console />
                </Spinner.Suspense>
            </div>
            <div className={'grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-4'}>
                <Spinner.Suspense>
                    <StatGraphs />
                </Spinner.Suspense>
            </div>
            <Features enabled={eggFeatures} />
        </ServerContentBlock>
    );
};

export default memo(ServerConsoleContainer, isEqual);
