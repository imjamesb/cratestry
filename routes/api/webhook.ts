import {
  type HandlerContext,
  type Handlers,
  type RouteConfig,
} from "$fresh/server.ts";
import { assert } from "https://deno.land/std@0.166.0/testing/asserts.ts";

export const config: RouteConfig = {
  routeOverride: "/api/webhook/:name",
};

// deno-lint-ignore no-explicit-any
function assertOwnerType(value: any, kind: "repository.owner" | "sender") {
  assert(
    typeof value === "object" || value !== null,
    `${kind} must be an object!`,
  );
  assert(typeof value.id === "number", `${kind}.id must be a number!`);
  assert(typeof value.login === "string", `${kind}.login must be a string!`);
  assert(
    typeof value.avatar_url === "string" ||
      typeof value.avatar_url === "undefined" || value.avatar_url === null,
    `${kind}.avatar_url must be undefined, null or a type of string!`,
  );
  assert(
    typeof value.html_url === "string",
    `${kind}.html_url must be a string!`,
  );
  assert(typeof value.type === "string", `${kind}.type must be a string!`);
}

export const handler: Handlers = {
  POST: async (req: Request, ctx: HandlerContext): Promise<Response> => {
    const { name } = ctx.params;
    if (req.headers.get("content-type") !== "application/json") {
      return Response.json({ error: "Content-type must be application/json" }, {
        status: 400,
      });
    }
    if (
      !req.headers.has("user-agent") ||
      !req.headers.get("user-agent")!.startsWith("GitHub-Hookshot/")
    ) return Response.json({ error: "Invalid user-agent!" }, { status: 400 });

    if (
      !req.headers.has("x-github-delivery")
    ) {
      return Response.json({ error: "Missing github delivery ID." }, {
        status: 400,
      });
    }

    if (
      req.headers.get("x-github-event") !== "create" &&
      req.headers.get("x-github-event") !== "ping"
    ) return Response.json({ error: "Invalid github event!" }, { status: 400 });

    if (
      !req.headers.has("x-github-hook-id")
    ) {
      return Response.json({ error: "Missing github hook ID." }, {
        status: 400,
      });
    }

    if (
      !req.headers.has("x-github-hook-installation-target-id")
    ) {
      return Response.json({
        error: "Missing github hook installation target ID.",
      }, {
        status: 400,
      });
    }

    if (
      req.headers.get("x-github-hook-installation-target-type") !== "repository"
    ) {
      return Response.json({
        error: "Invalid github hook installation target type!",
      }, { status: 400 });
    }

    // deno-lint-ignore no-explicit-any
    let body: any = undefined;
    try {
      body = await req.json();
    } catch {
      return Response.json({ error: "Could not parse body!" }, { status: 400 });
    }

    if (req.headers.get("x-github-event") === "ping") {
      try {
        assert(
          typeof body === "object" && body !== null,
          "Body must be an object!",
        );
        assert(
          typeof body.description === "string" || body.description === null ||
            typeof body.description === "undefined",
          "Repository description must be undefined, null or string!",
        );
        assert(
          typeof body.repository === "object" && body.repository !== null,
          "Repository must be an object!",
        );
        assert(
          typeof body.repository.id === "number",
          "Repository ID must be a number!",
        );
        assert(
          typeof body.repository.name === "string",
          "Repository name must be a string!",
        );
        assert(
          typeof body.repository.full_name === "string",
          "Repository full_name must be a string!",
        );
        assert(
          typeof body.repository.private === "boolean",
          "repository.private must be a boolean!",
        );
        assert(
          typeof body.repository.visibility === "string",
          "repository.visibility must be a string!",
        );
        assert(
          typeof body.repository.html_url === "string",
          "repository.html_url must be a string!",
        );
        assert(
          body.repository.visibility === "public",
          "repository.visibility must be 'public'!",
        );
        assert(
          body.repository.private === false,
          "Repository must be public!",
        );
        assertOwnerType(body.repository.owner, "repository.owner");
        assertOwnerType(body.sender, "sender");
      } catch (error) {
        return Response.json(
          { error: "Invalid body!", reason: error.message },
          { status: 400 },
        );
      }
      // todo(imjamesb): Register the crate in the database.
      return Response.json({ error: "not implemented" }, { status: 501 });
    }

    if (
      !(
        typeof body === "object" && body !== null &&
        typeof body.ref === "string" &&
        typeof body.ref_type === "string" &&
        typeof body.description === "string" &&
        typeof body.pusher_type === "string" &&
        typeof body.repository === "object" &&
        body.repository !== null && typeof body.repository.id === "number" &&
        typeof body.repository.name === "string" &&
        typeof body.repository.full_name === "string" &&
        typeof body.repository.private === "boolean" &&
        typeof body.repository.owner === "object" &&
        body.repository.owner !== null &&
        typeof body.repository.owner.login === "string" &&
        typeof body.repository.owner.id === "number" &&
        (typeof body.repository.owner.avatar_url === "string" ||
          typeof body.repository.owner.avatar_url === "undefined") &&
        typeof body.repository.owner.html_url === "string" &&
        typeof body.repository.owner.type === "string" &&
        typeof body.repository.html_url === "string" &&
        typeof body.repository.visibility === "string" &&
        typeof body.sender === "object" && body.sender !== null &&
        typeof body.sender.login === "string" &&
        typeof body.sender.id === "number" &&
        (typeof body.sender.avatar_url === "string" ||
          typeof body.sender.avatar_url === "undefined") &&
        typeof body.sender.html_url === "string" &&
        typeof body.sender.type === "string"
      )
    ) {
      return Response.json({ error: "Invalid body!" }, { status: 400 });
    }

    if (body.ref_type !== "tag") {
      return Response.json({ error: "ref_type must be a tag!" }, {
        status: 400,
      });
    }

    if (body.repository.private !== true) {
      return Response.json({ error: "Visibility must be public!" }, {
        status: 400,
      });
    }

    // Create a new tag on the crate.
    return Response.json({ error: "not implemented" }, { status: 501 });
  },
};
