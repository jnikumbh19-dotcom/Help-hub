REQ-001
Description: Users can register, login and logout.
Source: Frontend `AuthView.tsx` & App state
Priority: High
Backend impact: Auth APIs + User model
Status: Pending

REQ-002
Description: Users can manage their ICE (In Case of Emergency) medical profile.
Source: Frontend `UserDashboardView.tsx`
Priority: High
Backend impact: User profile update API
Status: Pending

REQ-003
Description: Users can view and search service providers by category and location.
Source: Frontend `CategoryListView.tsx`
Priority: High
Backend impact: Provider search/filter API
Status: Pending

REQ-004
Description: Business owners can register their emergency service providers.
Source: Frontend `BusinessPanelView.tsx`
Priority: High
Backend impact: Provider creation API
Status: Pending

REQ-005
Description: Business owners can update their service provider profiles (operating hours, capacity, etc).
Source: Frontend `BusinessPanelView.tsx`
Priority: High
Backend impact: Provider update API + Authorization check
Status: Pending

REQ-006
Description: Admins can approve, verify, or reject service providers.
Source: Frontend `AdminDashboardView.tsx`
Priority: High
Backend impact: Provider verification API + Audit log API
Status: Pending

REQ-007
Description: Users can file complaints against service providers.
Source: Frontend `UserDashboardView.tsx`
Priority: Medium
Backend impact: Complaint creation API
Status: Pending

REQ-008
Description: Admins can resolve or dismiss complaints.
Source: Frontend `AdminDashboardView.tsx`
Priority: Medium
Backend impact: Complaint status update API + Audit log API
Status: Pending

REQ-009
Description: Admins can manage cities (add new, toggle active status).
Source: Frontend `AdminDashboardView.tsx`
Priority: Low
Backend impact: City management API
Status: Pending

REQ-010
Description: System maintains audit logs for admin/business actions.
Source: Frontend `AdminDashboardView.tsx`
Priority: Medium
Backend impact: Audit log model + insertion triggers/hooks
Status: Pending
