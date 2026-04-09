# Database Migrations

## Naming Convention

Migration files follow this pattern:

```
YYYYMMDD_HHMMSS_short_description.sql
```

Example: `20250115_120000_create_demo_notes.sql`

## Creating a New Migration

1. Create a new `.sql` file in `database/migrations/` following the naming convention above.
2. Use `database/migrations/TEMPLATE_rls.sql` as a starting point for tables with user data.
3. Follow the migration checklist below before committing.

## Running Migrations

Run migrations against your Supabase project using one of:

- **Supabase Dashboard:** Open the SQL Editor and paste the migration SQL.
- **Supabase CLI:** Run `supabase db push` to apply pending migrations.

## RLS Requirements

Every new table **MUST** have Row Level Security (RLS) enabled. Every table containing user data **MUST** have:

- A `user_id` column referencing `auth.users(id)` with `ON DELETE CASCADE`.
- Owner-only policies for SELECT, INSERT, UPDATE, and DELETE.

## Migration Checklist

Before committing a migration, verify:

- [ ] RLS enabled on all new tables
- [ ] Owner policies for SELECT, INSERT, UPDATE, DELETE
- [ ] `user_id` column with foreign key to `auth.users(id)` and `ON DELETE CASCADE`
- [ ] Tested in Supabase Dashboard SQL Editor before committing
