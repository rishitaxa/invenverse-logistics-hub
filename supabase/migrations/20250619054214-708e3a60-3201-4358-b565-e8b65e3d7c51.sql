
-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  location TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  order_number TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Processing',
  priority TEXT NOT NULL DEFAULT 'Medium',
  total_amount DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create shipments table
CREATE TABLE public.shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  shipment_number TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('inbound', 'outbound')),
  status TEXT NOT NULL DEFAULT 'Scheduled',
  supplier TEXT,
  customer TEXT,
  tracking_number TEXT,
  estimated_delivery DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create shipment_items table
CREATE TABLE public.shipment_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID REFERENCES public.shipments(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create custom_paths table for grid pathfinding
CREATE TABLE public.custom_paths (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  start_x INTEGER NOT NULL,
  start_y INTEGER NOT NULL,
  end_x INTEGER NOT NULL,
  end_y INTEGER NOT NULL,
  algorithm TEXT NOT NULL,
  length DECIMAL(10,2) NOT NULL,
  grid_size INTEGER NOT NULL DEFAULT 15,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create warehouse_zones table
CREATE TABLE public.warehouse_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  zone_id TEXT NOT NULL,
  utilization INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Optimal',
  capacity INTEGER NOT NULL DEFAULT 1000,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipment_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warehouse_zones ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for products
CREATE POLICY "Users can view their own products" ON public.products
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own products" ON public.products
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own products" ON public.products
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own products" ON public.products
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for orders
CREATE POLICY "Users can view their own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders" ON public.orders
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own orders" ON public.orders
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for order_items
CREATE POLICY "Users can view their own order items" ON public.order_items
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
  ));

CREATE POLICY "Users can create their own order items" ON public.order_items
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
  ));

CREATE POLICY "Users can update their own order items" ON public.order_items
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete their own order items" ON public.order_items
  FOR DELETE USING (EXISTS (
    SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
  ));

-- Create RLS policies for shipments
CREATE POLICY "Users can view their own shipments" ON public.shipments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own shipments" ON public.shipments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own shipments" ON public.shipments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own shipments" ON public.shipments
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for shipment_items
CREATE POLICY "Users can view their own shipment items" ON public.shipment_items
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.shipments WHERE shipments.id = shipment_items.shipment_id AND shipments.user_id = auth.uid()
  ));

CREATE POLICY "Users can create their own shipment items" ON public.shipment_items
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM public.shipments WHERE shipments.id = shipment_items.shipment_id AND shipments.user_id = auth.uid()
  ));

CREATE POLICY "Users can update their own shipment items" ON public.shipment_items
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM public.shipments WHERE shipments.id = shipment_items.shipment_id AND shipments.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete their own shipment items" ON public.shipment_items
  FOR DELETE USING (EXISTS (
    SELECT 1 FROM public.shipments WHERE shipments.id = shipment_items.shipment_id AND shipments.user_id = auth.uid()
  ));

-- Create RLS policies for custom_paths
CREATE POLICY "Users can view their own custom paths" ON public.custom_paths
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own custom paths" ON public.custom_paths
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own custom paths" ON public.custom_paths
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own custom paths" ON public.custom_paths
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for warehouse_zones
CREATE POLICY "Users can view their own warehouse zones" ON public.warehouse_zones
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own warehouse zones" ON public.warehouse_zones
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own warehouse zones" ON public.warehouse_zones
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own warehouse zones" ON public.warehouse_zones
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX idx_products_user_id ON public.products(user_id);
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_shipments_user_id ON public.shipments(user_id);
CREATE INDEX idx_custom_paths_user_id ON public.custom_paths(user_id);
CREATE INDEX idx_warehouse_zones_user_id ON public.warehouse_zones(user_id);
