import {NGXLogger} from 'ngx-logger';
import {EMPTY} from 'rxjs';

export function appInitializer(logger: NGXLogger) {
  return () => new Promise(resolve => {
    logger.debug("Initialized app");
    return EMPTY.subscribe().add(resolve);
  });
}
