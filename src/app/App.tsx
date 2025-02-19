import { changeThemeInMarkup, getSystemPreferredTheme } from '@shlinkio/shlink-frontend-kit';
import type { Settings } from '@shlinkio/shlink-web-component/settings';
import { clsx } from 'clsx';
import type { FC } from 'react';
import { useEffect, useRef } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AppUpdateBanner } from '../common/AppUpdateBanner';
import { NotFound } from '../common/NotFound';
import type { FCWithDeps } from '../container/utils';
import { componentFactory, useDependencies } from '../container/utils';
import type { ServersMap } from '../servers/data';
import { forceUpdate } from '../utils/helpers/sw';
import './App.scss';
import type { MainHeaderDeps, MainHeaderProps} from '../common/MainHeader';

type AppProps = {
	fetchServers: () => void;
	servers: ServersMap;
	settings: Settings;
	resetAppUpdate: () => void;
	appUpdated: boolean;
};

type AppDeps = {
	MainHeader: FCWithDeps<MainHeaderProps, MainHeaderDeps>;
	Home: FC;
	ShlinkWebComponentContainer: FC;
	CreateServer: FC;
	EditServer: FC;
	Settings: FC;
	ManageServers: FC;
	ShlinkVersionsContainer: FC;
};

const App: FCWithDeps<AppProps, AppDeps> = (
	{ fetchServers, servers, settings, appUpdated, resetAppUpdate },
) => {
	const {
		MainHeader,
		Home,
		ShlinkWebComponentContainer,
		CreateServer,
		EditServer,
		Settings,
		ManageServers,
		ShlinkVersionsContainer,
	} = useDependencies(App);

	const location = useLocation();
	const initialServers = useRef(servers);
	const isHome = location.pathname === '/';
	const firstServerIDUrl = `/server/${Object.keys(servers)[0] ?? ''}/`;

	useEffect(() => {
		// Try to fetch the remote servers if the list is empty at first
		// We use a ref because we don't care if the servers list becomes empty later
		if (Object.keys(initialServers.current).length === 0) {
			fetchServers();
		}
	}, [fetchServers]);

	useEffect(() => {
		changeThemeInMarkup(settings.ui?.theme ?? getSystemPreferredTheme());
	}, [settings.ui?.theme]);

	return (
		<div className="container-fluid app-container">
			<MainHeader servers={servers} /> {/* Pass servers here */}

			<div className="app">
				<div className={clsx('shlink-wrapper', { 'd-flex align-items-center pt-3': isHome })}>
					<Routes>
						{Object.keys(servers).length === 1 ? (
							<>
								<Route path="/" element={<Navigate to={firstServerIDUrl} replace />} />
								<Route path="/server/:serverId/*" element={<ShlinkWebComponentContainer />} />
								<Route path="/settings/*" element={<Settings />} />
								<Route path="*" element={<NotFound />} />
							</>
						) : (
							<>
								<Route index element={<Home />} />
								<Route path="/settings/*" element={<Settings />} />
								<Route path="/manage-servers" element={<ManageServers />} />
								<Route path="/server/create" element={<CreateServer />} />
								<Route path="/server/:serverId/edit" element={<EditServer />} />
								<Route path="/server/:serverId/*" element={<ShlinkWebComponentContainer />} />
								<Route path="*" element={<NotFound />} />
							</>
						)}
					</Routes>
				</div>

				<div className="shlink-footer">
					<ShlinkVersionsContainer />
				</div>
			</div>

			<AppUpdateBanner isOpen={appUpdated} toggle={resetAppUpdate} forceUpdate={forceUpdate} />
		</div>
	);
};
export const AppFactory = componentFactory(App, [
	'MainHeader',
	'Home',
	'ShlinkWebComponentContainer',
	'CreateServer',
	'EditServer',
	'Settings',
	'ManageServers',
	'ShlinkVersionsContainer',
]);
