import type Bottle from 'bottlejs';
import type { ConnectDecorator } from '../../container/types';
import { AppFactory } from '../App';
import { appUpdateAvailable, resetAppUpdate } from '../reducers/appUpdates';

export const provideServices = (bottle: Bottle, connect: ConnectDecorator) => {
  // Components
  bottle.factory('App', AppFactory);
  bottle.decorator(
    'App',
    connect(
      ['servers', 'settings', 'appUpdated'],
      ['fetchServers', 'resetAppUpdate']
    )
  );

  // Actions
  bottle.serviceFactory('appUpdateAvailable', () => appUpdateAvailable);
  bottle.serviceFactory('resetAppUpdate', () => resetAppUpdate);
};
