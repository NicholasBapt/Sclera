import { useEffect, useState } from "react";
import CardComponent from "../components/cardComponent";
import CardsContainer from "../components/CardsContainer";
import Text from "../components/Text";
import { getUsers, type User } from "../services/api";

export function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch {
        setError("Não foi possível carregar os usuários.");
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <CardsContainer variant="secondary">
        <CardComponent variant="tertiary" title="Total users">
          <Text variant="heading-lg" textColor="secondary">
            {loading ? "..." : users.length}
          </Text>
        </CardComponent>
      </CardsContainer>

      <CardComponent variant="tertiary" title="Users">
        <div className="flex flex-col gap-3 w-full p-3">
          {loading && <Text variant="body-md">Loading users...</Text>}

          {error && <Text variant="body-md">{error}</Text>}

          {!loading &&
            !error &&
            users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between rounded border border-blue-base bg-cloudy-light p-4"
              >
                <Text variant="body-md-bold">{user.name}</Text>

                <Text variant="body-sm" textColor="secondary">
                  ID: {user.id}
                </Text>
              </div>
            ))}
        </div>
      </CardComponent>
    </div>
  );
}
