import {
  type HandlerContext,
  type Handlers,
  type RouteConfig,
} from "$fresh/server.ts";

export const config: RouteConfig = {
  routeOverride: "/api/webhook/:name",
};

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
      if (
        !(
          typeof body === "object" && body !== null &&
          typeof body.description === "string" &&
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
      ) return Response.json({ error: "Invalid body!" }, { status: 400 });
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
