import Status from '../components/Status';
import UsersTable from '../components/UsersTable';

export default function Dashboard() {
    return (
        <div style={{ padding: '20px' }}>
            <h1>Production AWS Fargate App</h1>

            <Status />

            <hr />

            <UsersTable />
        </div>
    );
}
