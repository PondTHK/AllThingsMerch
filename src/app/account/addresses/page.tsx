import React from 'react';
import { getUserAddressesAction } from './actions';
import { AddressesClient } from './AddressesClient';

export default async function AccountAddressesPage() {
  const addresses = await getUserAddressesAction();

  return (
    <AddressesClient initialAddresses={addresses} />
  );
}
