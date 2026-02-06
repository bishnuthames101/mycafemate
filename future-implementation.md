# Future Implementation Plans

This document contains planned features and improvements for later implementation.

---

## 1. Data Retention & Order Archival System

### Problem
Orders are stored forever, causing database bloat:
- 50 orders/day = ~3-4 MB/month
- 1 year = ~40-50 MB per tenant
- 5 years = ~200-250 MB per tenant (hits 500 MB limit)

### Solution
Implement data aggregation + cleanup system:

1. **DailySales Aggregation**
   - Summarize each day's orders into one `DailySales` row
   - Store: total orders, revenue, tax, top products, sales by category
   - 100 orders → 1 summary row = 99% storage reduction

2. **Order Cleanup**
   - Keep detailed orders for 90 days (for refunds, disputes)
   - Delete orders older than 90 days after aggregation
   - Keep `DailySales` summaries forever

3. **Reports Update**
   - Last 90 days: Use detailed `Orders` table
   - Older than 90 days: Use `DailySales` summaries

### Implementation Options

| Option | Notes |
|--------|-------|
| **Supabase pg_cron** (Recommended) | PostgreSQL scheduled jobs, runs at 2 AM daily |
| On-demand aggregation | Aggregate when admin views reports |
| External cron (cron-job.org) | Free service calls API endpoints |

### Database Tables Involved
- `Order` - detailed orders (to be cleaned up)
- `OrderItem` - order line items (to be cleaned up)
- `DailySales` - aggregated summaries (already exists!)

### Cron Job Tasks
```
Daily at 2 AM:
1. Find orders from 91+ days ago
2. Aggregate into DailySales (if not already done)
3. Delete old orders and order items
4. Log cleanup results
```

### Admin Settings (Optional)
- Let tenant choose retention period: 30 / 60 / 90 / 180 days
- Show storage usage and projected savings

### Storage Impact
| Scenario | Without Archival | With Archival |
|----------|------------------|---------------|
| 1 year | ~50 MB | ~5 MB |
| 5 years | ~250 MB | ~25 MB |

---

## 2. [Add more future plans here]

---

*Last updated: 2025-02-06*
