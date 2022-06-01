/*
 * This file encapsulates the xthree library.
 * It checks if the needed three examples and the library are duplicated.
 */
import { checkDependancy, checkThreeRevision } from "three-js-checker";

// Duplication check

import { DebugRenderTarget } from "./exports.js";

const PACKAGE_NAME = "three-js-debug-rendertarget";

checkThreeRevision(PACKAGE_NAME, 130);

checkDependancy(PACKAGE_NAME, "DebugRenderTarget", DebugRenderTarget);

// Reexport API

export * from "./exports";
