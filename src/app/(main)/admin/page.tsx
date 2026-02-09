import { AdminGuard } from "@/components/AdminGuard";
import { AdminHomeContainer } from "@/containers/(main)/admin/AdminHomeContainer";

export default function AdminPage() {
    return (
        <AdminGuard>
            <AdminHomeContainer />
        </AdminGuard>
    );
}
