guests (
id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
name TEXT NOT NULL,
relation TEXT,
phone TEXT,
address TEXT,
created_at TIMESTAMPTZ DEFAULT NOW(),
wedding_id UUID REFERENCES weddings(id) ON DELETE CASCADE,
)

ledger (
id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
guest_id UUID REFERENCES guests(id) NULL,
amount integer NOT NULL CHECK (amount >= 0),
extracted_name TEXT,
status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED')),
entry_type TEXT NOT NULL CHECK (entry_type IN ('CASH', 'ENVELOPE', 'VOICE', 'MANUAL')),
media_url TEXT,
created_at TIMESTAMPTZ DEFAULT NOW()
wedding_id UUID REFERENCES weddings(id) ON DELETE CASCADE,
);

WEDDINGS(
id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
event_name TEXT,
event_date DATE,
created_at timestamp default NOW()
);
