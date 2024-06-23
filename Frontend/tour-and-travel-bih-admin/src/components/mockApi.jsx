// mockApi.js
export const fetchCounts = async () => {
  const accounts = await fetch(
    "http://localhost:5278/api/Account/GetAccountsCount/Accounts"
  ).then((res) => res.json());

  const reservations = await fetch(
    "http://localhost:5278/api/Reservation/GetReservationsCount/Reservations"
  ).then((res) => res.json());

  const tourPackages = await fetch(
    "http://localhost:5278/api/TourPackage/GetTourPackagesCount/TourPackages"
  ).then((res) => res.json());

  const users = await fetch(
    "http://localhost:5278/api/Users/GetUsersCount/Users"
  ).then((res) => res.json());

  return {
    accounts,
    reservations,
    tourPackages,
    users,
  };
};
