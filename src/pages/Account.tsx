import { FormEvent, useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { EmptyState } from '../components/AsyncState';
import { getId } from '../lib/format';
import { useToast } from '../lib/toast';
import { useAuthStore } from '../stores/auth.store';
import { useShippingCitiesStore } from '../stores/shippingCities.store';
import { Address } from '../types';

const blankAddress: Address = { fullName: '', phone: '', city: '', area: '', street: '', buildingNumber: '', apartmentNumber: '', notes: '' };
const normalizeCity = (value?: string) => value?.trim().toLowerCase() || '';

interface Confirmation {
  title: string;
  body: string;
  confirmLabel: string;
  variant?: 'default' | 'danger';
  onConfirm: () => Promise<void>;
}

export default function Account() {
  const { notify } = useToast();
  const { customer, loading, updateProfile, changePassword, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useAuthStore();
  const { cities, fetchShippingCities } = useShippingCitiesStore();
  const [profile, setProfile] = useState({ fullName: customer?.fullName || '', phone: customer?.phone || '' });
  const [password, setPassword] = useState({ currentPassword: '', newPassword: '' });
  const [address, setAddress] = useState<Address>(blankAddress);
  const [editingId, setEditingId] = useState('');
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const addresses = customer?.addresses || [];
  const selectedAddressCity = cities.find((city) => normalizeCity(city.name) === normalizeCity(address.city));
  const hasProfileChanges = profile.fullName.trim() !== (customer?.fullName || '').trim()
    || profile.phone.trim() !== (customer?.phone || '').trim();
  const canSaveProfile = hasProfileChanges && Boolean(profile.fullName.trim() || profile.phone.trim());
  const canSavePassword = Boolean(password.currentPassword.trim() && password.newPassword.trim());
  const hasAddressData = Object.values(address).some((value) => String(value || '').trim());
  const hasRequiredAddressData = Boolean(
    address.fullName?.trim()
    && address.phone?.trim()
    && address.city?.trim()
    && address.area?.trim()
    && address.street?.trim(),
  );
  const canSaveAddress = hasAddressData && hasRequiredAddressData && Boolean(selectedAddressCity);

  useEffect(() => {
    fetchShippingCities();
  }, [fetchShippingCities]);

  const runConfirmedAction = async () => {
    if (!confirmation) return;
    try {
      await confirmation.onConfirm();
      setConfirmation(null);
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Action failed.', 'error');
    }
  };

  const saveProfile = async () => {
    await updateProfile(profile);
    notify('Profile updated.', 'success');
  };

  const requestSaveProfile = (event: FormEvent) => {
    event.preventDefault();
    if (!canSaveProfile) return;
    setConfirmation({
      title: 'Save Profile',
      body: 'Are you sure you want to update your profile information?',
      confirmLabel: 'Save Profile',
      onConfirm: saveProfile,
    });
  };

  const savePassword = async () => {
    await changePassword(password);
    setPassword({ currentPassword: '', newPassword: '' });
    notify('Password changed.', 'success');
  };

  const requestSavePassword = (event: FormEvent) => {
    event.preventDefault();
    if (!canSavePassword) return;
    setConfirmation({
      title: 'Change Password',
      body: 'Are you sure you want to change your password?',
      confirmLabel: 'Change Password',
      onConfirm: savePassword,
    });
  };

  const saveAddress = async () => {
    if (editingId) await updateAddress(editingId, address);
    else await addAddress(address);
    setAddress(blankAddress);
    setEditingId('');
    notify('Address saved.', 'success');
  };

  const requestSaveAddress = (event: FormEvent) => {
    event.preventDefault();
    if (!hasAddressData) return;
    if (!hasRequiredAddressData) {
      notify('Please complete the required address details.', 'error');
      return;
    }
    if (!selectedAddressCity) {
      notify('Please choose an available shipping city.', 'error');
      return;
    }
    setConfirmation({
      title: editingId ? 'Update Address' : 'Add Address',
      body: editingId ? 'Are you sure you want to update this address?' : 'Are you sure you want to add this address?',
      confirmLabel: editingId ? 'Update Address' : 'Add Address',
      onConfirm: saveAddress,
    });
  };

  const edit = (item: Address) => {
    setEditingId(getId(item));
    const cityName = getAddressCity(item);
    const matchingCity = cities.find((city) => normalizeCity(city.name) === normalizeCity(cityName));
    setAddress({ ...item, city: matchingCity?.name || cityName });
  };

  const confirmAddressAction = (options: Confirmation) => {
    setConfirmation(options);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-24">
      <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-12">Account</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <form onSubmit={requestSaveProfile} className="border border-zinc-800 bg-zinc-950 p-8 space-y-4">
          <h2 className="text-2xl font-black uppercase text-white mb-4">Profile</h2>
          <input value={profile.fullName} onChange={(event) => setProfile({ ...profile, fullName: event.target.value })} placeholder="Full name" className="w-full bg-zinc-900 border border-zinc-800 p-4 text-white" />
          <input value={customer?.email || ''} disabled className="w-full bg-zinc-900 border border-zinc-800 p-4 text-zinc-500" />
          <input value={profile.phone} onChange={(event) => setProfile({ ...profile, phone: event.target.value })} placeholder="Phone" className="w-full bg-zinc-900 border border-zinc-800 p-4 text-white" />
          <button disabled={loading || !canSaveProfile} className="w-full rounded-full bg-primary px-8 py-3 font-black uppercase text-white disabled:cursor-not-allowed disabled:opacity-60 sm:w-fit">Save Profile</button>
        </form>

        <form onSubmit={requestSavePassword} className="border border-zinc-800 bg-zinc-950 p-8 space-y-4">
          <h2 className="text-2xl font-black uppercase text-white mb-4">Password</h2>
          <input value={password.currentPassword} onChange={(event) => setPassword({ ...password, currentPassword: event.target.value })} type="password" required placeholder="Current password" className="w-full bg-zinc-900 border border-zinc-800 p-4 text-white" />
          <input value={password.newPassword} onChange={(event) => setPassword({ ...password, newPassword: event.target.value })} type="password" required placeholder="New password" className="w-full bg-zinc-900 border border-zinc-800 p-4 text-white" />
          <button disabled={loading || !canSavePassword} className="w-full rounded-full bg-primary px-8 py-3 font-black uppercase text-white disabled:cursor-not-allowed disabled:opacity-60 sm:w-fit">Change Password</button>
        </form>
      </div>

      <section className="mt-12 border border-zinc-800 bg-zinc-950 p-8">
        <h2 className="text-2xl font-black uppercase text-white mb-6">Address Book</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            {!addresses.length ? <EmptyState title="No addresses" body="Add a shipping address for faster checkout." /> : addresses.map((item) => (
              <div key={getId(item)} className="border border-zinc-800 bg-black p-5">
                <div className="flex justify-between gap-4">
                  <div>
                    <p className="font-black text-white">{item.fullName} {item.isDefault ? <span className="text-primary">(Default)</span> : null}</p>
                    <p className="text-sm text-zinc-400">{item.street}, {item.area}, {getAddressCity(item)}</p>
                    <p className="text-sm text-zinc-500">{item.phone}</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-1 gap-2 sm:flex sm:flex-wrap">
                  <button type="button" onClick={() => edit(item)} className="w-full rounded-lg cursor-pointer border border-zinc-700 px-4 py-2 text-xs font-black uppercase text-white sm:w-auto">Edit</button>
                  <button
                    type="button"
                    onClick={() => confirmAddressAction({
                      title: 'Set Default Address',
                      body: `Use ${item.fullName || 'this address'} as your default shipping address?`,
                      confirmLabel: 'Set Default',
                      onConfirm: async () => {
                        await setDefaultAddress(getId(item));
                        notify('Default address updated.', 'success');
                      },
                    })}
                    className="w-full rounded-lg cursor-pointer border border-zinc-700 px-4 py-2 text-xs font-black uppercase text-white sm:w-auto"
                  >
                    Default
                  </button>
                  <button
                    type="button"
                    onClick={() => confirmAddressAction({
                      title: 'Delete Address',
                      body: `Are you sure you want to delete ${item.fullName || 'this address'}? This cannot be undone.`,
                      confirmLabel: 'Delete',
                      variant: 'danger',
                      onConfirm: async () => {
                        await deleteAddress(getId(item));
                        notify('Address deleted.', 'success');
                      },
                    })}
                    className="w-full rounded-lg cursor-pointer border border-zinc-700 px-4 py-2 text-xs font-black uppercase text-white sm:w-auto"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={requestSaveAddress} className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input value={address.fullName || ''} onChange={(event) => setAddress({ ...address, fullName: event.target.value })} placeholder="Full name" className="bg-zinc-900 border border-zinc-800 p-4 text-white" />
            <input value={address.phone || ''} onChange={(event) => setAddress({ ...address, phone: event.target.value })} placeholder="Phone" className="bg-zinc-900 border border-zinc-800 p-4 text-white" />
            <div className="relative">
              <select value={address.city || ''} onChange={(event) => setAddress({ ...address, city: event.target.value })} className="w-full appearance-none bg-zinc-900 border border-zinc-800 py-4 pl-4 pr-12 text-white outline-none focus:border-primary">
                <option value="">Choose city</option>
                {cities.map((city) => <option key={city.name} value={city.name}>{city.name}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary" />
            </div>
            <input value={address.area || ''} onChange={(event) => setAddress({ ...address, area: event.target.value })} placeholder="Area" className="bg-zinc-900 border border-zinc-800 p-4 text-white" />
            <input value={address.street || ''} onChange={(event) => setAddress({ ...address, street: event.target.value })} placeholder="Street" className="md:col-span-2 bg-zinc-900 border border-zinc-800 p-4 text-white" />
            <input value={address.buildingNumber || ''} onChange={(event) => setAddress({ ...address, buildingNumber: event.target.value })} placeholder="Building number" className="bg-zinc-900 border border-zinc-800 p-4 text-white" />
            <input value={address.apartmentNumber || ''} onChange={(event) => setAddress({ ...address, apartmentNumber: event.target.value })} placeholder="Apartment number" className="bg-zinc-900 border border-zinc-800 p-4 text-white" />
            <input value={address.notes || ''} onChange={(event) => setAddress({ ...address, notes: event.target.value })} placeholder="Notes" className="md:col-span-2 bg-zinc-900 border border-zinc-800 p-4 text-white" />
            <button disabled={loading || !canSaveAddress} className="md:col-span-2 w-full rounded-full bg-primary px-8 py-3 font-black uppercase text-white disabled:cursor-not-allowed disabled:opacity-60">{editingId ? 'Update Address' : 'Add Address'}</button>
          </form>
        </div>
      </section>

      {confirmation ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 p-4" role="dialog" aria-modal="true" aria-labelledby="account-confirm-title">
          <div className="w-full max-w-md border border-zinc-800 bg-zinc-950 p-6 shadow-2xl shadow-black">
            <h2 id="account-confirm-title" className="text-2xl font-black uppercase text-white">{confirmation.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">{confirmation.body}</p>
            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setConfirmation(null)}
                disabled={loading}
                className="rounded-full border border-zinc-700 px-6 py-3 text-xs font-black uppercase tracking-widest text-white transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={runConfirmedAction}
                disabled={loading}
                className={`rounded-full px-6 py-3 text-xs font-black uppercase tracking-widest text-white transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                  confirmation.variant === 'danger'
                    ? 'bg-red-700 hover:bg-red-600'
                    : 'bg-primary hover:bg-primary-hover'
                }`}
              >
                {loading ? 'Working...' : confirmation.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function getAddressCity(address: Address) {
  const city = address.city as unknown;

  if (typeof city === 'string') return city;
  if (typeof city === 'object' && city && 'name' in city) {
    const cityName = (city as { name?: unknown }).name;
    return typeof cityName === 'string' ? cityName : '';
  }

  return '';
}
