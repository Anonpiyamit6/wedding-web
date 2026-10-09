// ดึงข้อมูลคำอวยพรทั้งหมด
export async function onRequestGet({ env }) {
  try {
    // DB คือชื่อที่เราจะตั้งใน Cloudflare
    const { results } = await env.DB.prepare(
      "SELECT * FROM wishes ORDER BY created_at DESC"
    ).all();
    return Response.json(results);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// บันทึกคำอวยพรใหม่
export async function onRequestPost({ request, env }) {
  try {
    const data = await request.json();
    
    // ตรวจสอบว่าส่งข้อมูลมาครบไหม
    if (!data.guest_name || !data.message) {
      return Response.json({ error: "ข้อมูลไม่ครบ" }, { status: 400 });
    }

    await env.DB.prepare(
      "INSERT INTO wishes (guest_name, message) VALUES (?, ?)"
    ).bind(data.guest_name, data.message).run();

    return Response.json({ success: true }, { status: 201 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
