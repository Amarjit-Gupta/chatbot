import axios from "axios";

const API_URL = "https://openrouter.ai/api/v1/chat/completions";

export async function POST(request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return Response.json(
        {
          success: false,
          error: "prompt is required",
        },
        { status: 400 },
      );
    }

    const response = await axios.post(
      API_URL,
      {
        model: "openrouter/free",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    return Response.json({
      success: true,
      reply: response.data.choices[0].message.content,
    });
  } catch (error) {
    console.error(error.response?.data || error.message);

    return Response.json(
      {
        success: false,
        error: error.response?.data || error.message,
      },
      { status: 500 },
    );
  }
}
