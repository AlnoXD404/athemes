import * as React from 'react';
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useLocation } from 'react-router';
import { CSSTransition } from 'react-transition-group';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faChevronDown, faCogs, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { useStoreState } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import SearchContainer from '@/components/dashboard/search/SearchContainer';
import tw from 'twin.macro';
import styled from 'styled-components/macro';
import http from '@/api/http';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import Avatar from '@/components/Avatar';

const DRAWER_TRANSITION = 200;

interface SidebarContextValue {
    close: () => void;
}

const SidebarContext = createContext<SidebarContextValue>({
    close: () => undefined,
});

interface DropdownProps {
    title: string;
    icon?: IconProp;
    to?: string;
}

const SidebarLink = styled(NavLink)`
    ${tw`flex items-center gap-3 px-4 py-3 mx-3 text-base font-semibold text-neutral-300 no-underline rounded-xl transition-colors duration-150`};

    &:hover {
        ${tw`text-neutral-100 bg-neutral-800/60`};
    }

    &:active,
    &.active {
        ${tw`text-white bg-[#0066ff]`};
    }
`;

const DropdownLink = styled(NavLink)`
    ${tw`flex items-center gap-3 py-3 pl-8 pr-4 mx-3 text-base font-semibold text-neutral-400 no-underline whitespace-nowrap rounded-xl transition-colors duration-150`};

    &:hover {
        ${tw`text-neutral-100 bg-neutral-800/40`};
    }

    &:active,
    &.active {
        ${tw`text-white bg-[#0066ff]`};
    }
`;

const DropdownExternalLink = styled.a`
    ${tw`flex items-center gap-3 py-3 pl-8 pr-4 mx-3 text-base font-semibold text-neutral-400 no-underline whitespace-nowrap rounded-xl transition-colors duration-150`};

    &:hover {
        ${tw`text-neutral-100 bg-neutral-800/40`};
    }
`;

const LogoLink = styled(Link)`
    ${tw`font-header font-medium no-underline bg-gradient-to-r from-cyan-400 to-primary-500 bg-clip-text text-transparent transition-all duration-150`};

    &:hover {
        filter: brightness(1.25);
    }
`;

const MobileBackdrop = styled.div`
    ${tw`absolute inset-0 bg-black/50`};

    &.fade-enter {
        opacity: 0;
    }

    &.fade-enter-active {
        opacity: 1;
        transition: opacity ${DRAWER_TRANSITION}ms ease;
    }

    &.fade-exit {
        opacity: 1;
    }

    &.fade-exit-active {
        opacity: 0;
        transition: opacity ${DRAWER_TRANSITION}ms ease;
    }
`;

const MobileDrawer = styled.div`
    ${tw`absolute left-0 top-0 h-full w-[230px] max-w-[85vw] bg-neutral-900 shadow-2xl flex flex-col`};

    &.slide-enter {
        transform: translateX(-100%);
    }

    &.slide-enter-active {
        transform: translateX(0);
        transition: transform ${DRAWER_TRANSITION}ms ease;
    }

    &.slide-exit {
        transform: translateX(0);
    }

    &.slide-exit-active {
        transform: translateX(-100%);
        transition: transform ${DRAWER_TRANSITION}ms ease;
    }
`;

const SidebarSection: React.FC<DropdownProps> = ({ title, icon, to, children }) => {
    const location = useLocation();
    const { close } = useContext(SidebarContext);

    const active = !!to && location.pathname.startsWith(to);
    const [expanded, setExpanded] = useState(active);
    const open = expanded || active;

    return (
        <div>
            <button
                onClick={() => setExpanded((value) => !value)}
                css={[
                    tw`w-full flex items-center justify-between gap-3 px-4 py-3 mx-3 text-base font-semibold text-neutral-300 rounded-xl transition-colors duration-150 cursor-pointer select-none`,
                    active ? tw`text-white bg-[#0066ff]` : tw`hover:text-neutral-100 hover:bg-neutral-800/60`,
                ]}
            >
                <span css={tw`flex items-center gap-3 min-w-0`}>
                    {icon && <FontAwesomeIcon icon={icon} css={tw`w-5 h-5 flex-shrink-0`} />}
                    <span css={tw`truncate`}>{title}</span>
                </span>
                <FontAwesomeIcon
                    icon={faChevronDown}
                    css={[tw`w-4 h-4 flex-shrink-0 transition-transform duration-250`, open ? tw`rotate-180` : undefined]}
                />
            </button>
            {open && (
                <div css={tw`pb-2`} onClick={() => close()}>
                    {children}
                </div>
            )}
        </div>
    );
};

interface SidebarProps {
    children: React.ReactNode;
    hideAccount?: boolean;
    hideSearch?: boolean;
}

const _Sidebar: React.FC<SidebarProps> = ({ children, hideAccount = false, hideSearch = false }) => {
    const name = useStoreState((state: ApplicationStore) => state.settings.data!.name);
    const username = useStoreState((state: ApplicationStore) => state.user.data!.username);
    const rootAdmin = useStoreState((state: ApplicationStore) => state.user.data!.rootAdmin);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mobileVisible, setMobileVisible] = useState(false);
    const closeTimer = useRef<number | null>(null);
    const touchStart = useRef<number | null>(null);
    const location = useLocation();

    const closeMobile = useCallback(() => {
        setMobileVisible(false);
        if (closeTimer.current) window.clearTimeout(closeTimer.current);
        closeTimer.current = window.setTimeout(() => setMobileOpen(false), DRAWER_TRANSITION);
    }, []);

    const openMobile = useCallback(() => {
        if (closeTimer.current) {
            window.clearTimeout(closeTimer.current);
            closeTimer.current = null;
        }
        setMobileOpen(true);
        requestAnimationFrame(() => setMobileVisible(true));
    }, []);

    useEffect(() => {
        closeMobile();
    }, [location.pathname, closeMobile]);

    useEffect(() => {
        document.body.style.overflow = mobileOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileOpen]);

    useEffect(() => {
        if (!mobileOpen) return;

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeMobile();
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [mobileOpen, closeMobile]);

    const onTouchStart = (e: React.TouchEvent) => {
        touchStart.current = e.touches[0].clientX;
    };

    const onTouchMove = (e: React.TouchEvent) => {
        if (touchStart.current === null) return;
        if (e.touches[0].clientX - touchStart.current < -50) {
            closeMobile();
            touchStart.current = null;
        }
    };

    const onTouchEnd = () => {
        touchStart.current = null;
    };

    const onTriggerLogout = () => {
        setIsLoggingOut(true);
        http.post('/auth/logout').finally(() => {
            // @ts-expect-error this is valid
            window.location = '/';
        });
    };

    const content = (
        <>
            <div css={tw`px-4 py-5 border-b border-neutral-800`}>
                <LogoLink to={'/'} css={tw`text-2xl`}>
                    {name}
                </LogoLink>
            </div>
            {!hideSearch && (
                <div css={tw`px-4 py-3 border-b border-neutral-800`}>
                    <SearchContainer />
                </div>
            )}
            <nav css={tw`flex-1 py-3 overflow-y-auto`}>{children}</nav>
            <div css={tw`border-t border-neutral-800 py-3`}>
                {!hideAccount && (
                    <>
                        <Link
                            to={'/account'}
                            css={tw`flex items-center gap-3 px-4 py-3 mx-3 text-sm font-medium text-neutral-300 no-underline rounded-xl transition-colors duration-150 hover:text-neutral-100 hover:bg-neutral-800/60`}
                        >
                            <span css={tw`flex items-center justify-center w-9 h-9 flex-shrink-0`}>
                                <Avatar.User />
                            </span>
                            {username}
                        </Link>
                        {rootAdmin && (
                            <a
                                href={'/admin'}
                                css={tw`flex items-center gap-3 px-4 py-3 mx-3 text-sm font-medium text-neutral-300 no-underline rounded-xl transition-colors duration-150 hover:text-neutral-100 hover:bg-neutral-800/60`}
                            >
                                <FontAwesomeIcon icon={faCogs} css={tw`w-5 h-5 flex-shrink-0`} />
                                Admin
                            </a>
                        )}
                    </>
                )}
                <button
                    onClick={onTriggerLogout}
                    css={tw`w-full flex items-center gap-3 px-4 py-3 mx-3 text-sm font-medium text-neutral-300 cursor-pointer rounded-xl transition-colors duration-150 hover:text-neutral-100 hover:bg-neutral-800/60`}
                >
                    <FontAwesomeIcon icon={faSignOutAlt} css={tw`w-5 h-5 flex-shrink-0`} />
                    Sign Out
                </button>
            </div>
        </>
    );

    return (
        <SidebarContext.Provider value={{ close: closeMobile }}>
            <SpinnerOverlay visible={isLoggingOut} />
            <div css={tw`md:hidden sticky top-0 z-40 flex items-center justify-between h-14 px-4 bg-neutral-900 shadow-md`}>
                <LogoLink to={'/'} css={tw`text-xl`}>
                    {name}
                </LogoLink>
                <button
                    onClick={openMobile}
                    css={tw`text-neutral-300 transition-colors duration-150 cursor-pointer hover:text-neutral-100`}
                >
                    <FontAwesomeIcon icon={faBars} css={tw`w-5 h-5`} />
                </button>
            </div>
            <aside css={tw`hidden md:flex flex-col w-[230px] flex-shrink-0 bg-neutral-900 border-r border-neutral-800 sticky top-0 h-screen`}>
                {content}
            </aside>
            {mobileOpen && (
                <div css={tw`fixed inset-0 z-50 md:hidden`}>
                    <CSSTransition in={mobileVisible} timeout={DRAWER_TRANSITION} classNames={'fade'}>
                        <MobileBackdrop onClick={closeMobile} />
                    </CSSTransition>
                    <CSSTransition in={mobileVisible} timeout={DRAWER_TRANSITION} classNames={'slide'}>
                        <MobileDrawer onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
                            {content}
                        </MobileDrawer>
                    </CSSTransition>
                </div>
            )}
        </SidebarContext.Provider>
    );
};

const Sidebar = Object.assign(_Sidebar, {
    Section: SidebarSection,
    Link: SidebarLink,
    DropdownLink: DropdownLink,
    DropdownExternalLink: DropdownExternalLink,
});

export default Sidebar;
