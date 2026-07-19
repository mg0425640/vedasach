-- Allow authenticated admins to manage all content
-- Comments: admin can SELECT all (including unapproved), UPDATE, DELETE
CREATE POLICY "admin_select_all_comments" ON comments FOR SELECT TO authenticated USING (true);
CREATE POLICY "admin_update_comments" ON comments FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_delete_comments" ON comments FOR DELETE TO authenticated USING (true);

-- Articles: admin can INSERT, UPDATE, DELETE
CREATE POLICY "admin_insert_articles" ON articles FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "admin_update_articles" ON articles FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_delete_articles" ON articles FOR DELETE TO authenticated USING (true);

-- Global ads: admin full CRUD
CREATE POLICY "admin_select_all_global_ads" ON global_ads FOR SELECT TO authenticated USING (true);
CREATE POLICY "admin_insert_global_ads" ON global_ads FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "admin_update_global_ads" ON global_ads FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_delete_global_ads" ON global_ads FOR DELETE TO authenticated USING (true);

-- Auth popup ads: admin full CRUD
CREATE POLICY "admin_select_all_auth_popup_ads" ON auth_popup_ads FOR SELECT TO authenticated USING (true);
CREATE POLICY "admin_insert_auth_popup_ads" ON auth_popup_ads FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "admin_update_auth_popup_ads" ON auth_popup_ads FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_delete_auth_popup_ads" ON auth_popup_ads FOR DELETE TO authenticated USING (true);

-- Category ads: admin full CRUD
CREATE POLICY "admin_select_all_category_ads" ON category_ads FOR SELECT TO authenticated USING (true);
CREATE POLICY "admin_insert_category_ads" ON category_ads FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "admin_update_category_ads" ON category_ads FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_delete_category_ads" ON category_ads FOR DELETE TO authenticated USING (true);

-- Orders: admin can SELECT all, UPDATE
CREATE POLICY "admin_select_all_orders" ON orders FOR SELECT TO authenticated USING (true);
CREATE POLICY "admin_update_orders" ON orders FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Order items: admin can SELECT all
CREATE POLICY "admin_select_order_items" ON order_items FOR SELECT TO authenticated USING (true);

-- Refunds: admin can SELECT all, INSERT, UPDATE
CREATE POLICY "admin_select_refunds" ON refunds FOR SELECT TO authenticated USING (true);
CREATE POLICY "admin_insert_refunds" ON refunds FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "admin_update_refunds" ON refunds FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Newsletter: admin can SELECT all
CREATE POLICY "admin_select_newsletter" ON newsletter_subscribers FOR SELECT TO authenticated USING (true);
