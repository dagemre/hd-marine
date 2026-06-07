-- İletişim formu ek alanları (Context/İletişim.png tasarımı):
-- "Ürünlerimiz hakkında bilgi almak ister misiniz?" (Evet/Hayır) ve
-- "Bilgi ve teklif almak istediğiniz ürünü seçiniz" (kategori adı, TR yazılır).
alter table public.contact_messages
  add column if not exists wants_product_info boolean,
  add column if not exists product_interest text;
