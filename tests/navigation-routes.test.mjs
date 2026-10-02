import assert from "node:assert/strict";
import test from "node:test";

import { groupApplicationRoutes, isApplicationRouteActive } from "../lib/routes.ts";

const route = (href) => ({ href, icon: "journey", label: "Route" });

test("navigation matches exact routes and their nested pages", () => {
  assert.equal(isApplicationRouteActive("/journey", route("/journey")), true);
  assert.equal(isApplicationRouteActive("/caregiver/modules/example", route("/caregiver")), true);
});

test("navigation does not activate routes that only share a text prefix", () => {
  assert.equal(isApplicationRouteActive("/profiles", route("/profile")), false);
  assert.equal(isApplicationRouteActive("/caregiver-tools", route("/caregiver")), false);
  assert.equal(isApplicationRouteActive("/journey", route("/")), false);
});

test("compact navigation chooses primary routes by identity rather than array position", () => {
  const routes = [
    route("/profile"),
    route("/resources"),
    route("/caregiver"),
    route("/journey"),
    route("/glossary"),
    route("/stories"),
    route("/progress"),
  ];

  const groups = groupApplicationRoutes(routes);

  assert.deepEqual(
    groups.primary.map(({ href }) => href),
    ["/journey", "/progress", "/stories", "/resources"],
  );
  assert.deepEqual(
    groups.secondary.map(({ href }) => href),
    ["/profile", "/caregiver", "/glossary"],
  );
});

test("compact navigation fills missing preferred slots without dropping routes", () => {
  const routes = [
    route("/journey"),
    route("/caregiver"),
    route("/glossary"),
    route("/profile"),
    route("/ai"),
    route("/other"),
  ];

  const groups = groupApplicationRoutes(routes);

  assert.equal(groups.primary.length, 4);
  assert.equal(groups.secondary.length, 2);
  assert.deepEqual(
    [...groups.primary, ...groups.secondary].map(({ href }) => href).sort(),
    routes.map(({ href }) => href).sort(),
  );
});
