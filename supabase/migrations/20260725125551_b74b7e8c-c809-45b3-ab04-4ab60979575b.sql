ALTER TABLE public.products DROP COLUMN IF EXISTS is_seasonal;
ALTER TABLE public.products DROP COLUMN IF EXISTS season_label;

DROP POLICY IF EXISTS "Anyone can view visible products" ON public.products;
CREATE POLICY "Anyone can view visible products"
ON public.products
FOR SELECT
TO anon, authenticated
USING (
  (
    is_visible = true
    AND (
      category_id IS NULL
      OR EXISTS (
        SELECT 1 FROM public.categories c
        WHERE c.id = products.category_id AND c.is_active = true
      )
    )
  )
  OR has_role(auth.uid(), 'admin'::app_role)
);