/// <reference types="cypress" />

import { cyEnv } from '../support/commands';
import { ApiPathsInterface } from '../support/interfaces';

const apiUrl = cyEnv('apiUrl');
const apiPaths = cyEnv('apiPaths') as ApiPathsInterface;
