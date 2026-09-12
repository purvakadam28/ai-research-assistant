export async function POST(request) {
  try {
    const body = await request.json();

    const response = await fetch(
      process.env.N8N_WEBHOOK_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: body.question,
          sessionId: body.sessionId,
          metadata: body.metadata,
        }),
      }
    );

    if (!response.ok) {
      return Response.json(
        { error: "n8n request failed" },
        { status: response.status }
      );
    }

    const data = await response.json();

    return Response.json(data);
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Unable to connect to research assistant" },
      { status: 500 }
    );
  }
}