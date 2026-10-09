export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare(
      "SELECT * FROM wishes ORDER BY created_at DESC"
    ).all();
    return Response.json(results);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function onRequestPost({ request, env }) {
  try {
    const data = await request.json();
    
    if (!data.guest_name || !data.message) {
      return Response.json({ error: "ข้อมูลไม่ครบ" }, { status: 400 });
    }

    // เพิ่มการบันทึกรูปภาพ (ถ้าไม่มีรูปให้เป็น null)
    await env.DB.prepare(
      "INSERT INTO wishes (guest_name, message, image_base64) VALUES (?, ?, ?)"
    ).bind(data.guest_name, data.message, data.image_base64 || null).run();

    return Response.json({ success: true }, { status: 201 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
