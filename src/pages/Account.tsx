import { FormEvent, useState } from 'react';
import { EmptyState } from '../components/AsyncState';
import { getId } from '../lib/format';
import { useToast } from '../lib/toast';
import { useAuthStore } from '../stores/auth.store';
import { Address } from '../types';

const blankAddress: Address = { fullName: '', phone: '', city: '', area: '', street: '', buildingNumber: '', apartmentNumber: '', notes: '' };

export default function Account() {
  const { notify } = useToast();
  const { customer, loading, updateProfile, changePassword, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useAuthStore();
  const [profile, setProfile] = useState({ fullName: customer?.fullName || '', phone: customer?.phone || '' });
  const [password, setPassword] = useState({ currentPassword: '', newPassword: '' });
  const [address, setAddress] = useState<Address>(blankAddress);
  const [editingId, setEditingId] = useState('');
  const addresses = customer?.addresses || [];

  const saveProfile = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await updateProfile(profile);
      notify('Profile updated.', 'success');
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Profile update failed.', 'error');
    }
  };

  const savePassword = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await changePassword(password);
      setPassword({ currentPassword: '', newPassword: '' });
      notify('Password changed.', 'success');
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Password change failed.', 'error');
    }
  };

  const saveAddress = async (event: FormEvent) => {
    event.preventDefault();
    try {
      if (editingId) await updateAddress(editingId, address);
      else await addAddress(address);
      setAddress(blankAddress);
      setEditingId('');
      notify('Address saved.', 'success');
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Address action failed.', 'error');
    }
  };

  const edit = (item: Address) => {
    setEditingId(getId(item));
    setAddress(item);
  };

  const action = async (callback: () => Promise<void>, message: string) => {
    try {
      await callback();
      notify(message, 'success');
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Address action failed.', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-24">
      <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-12">Account</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <form onSubmit={saveProfile} className="border border-zinc-800 bg-zinc-950 p-8 space-y-4">
          <h2 className="text-2xl font-black uppercase text-white mb-4">Profile</h2>
          <input value={profile.fullName} onChange={(event) => setProfile({ ...profile, fullName: event.target.value })} placeholder="Full name" className="w-full bg-zinc-900 border border-zinc-800 p-4 text-white" />
          <input value={customer?.email || ''} disabled className="w-full bg-zinc-900 border border-zinc-800 p-4 text-zinc-500" />
          <input value={profile.phone} onChange={(event) => setProfile({ ...profile, phone: event.target.value })} placeholder="Phone" className="w-full bg-zinc-900 border border-zinc-800 p-4 text-white" />
          <button disabled={loading} className="rounded-full bg-primary px-8 py-3 font-black uppercase text-white disabled:opacity-60">Save Profile</button>
        </form>

        <form onSubmit={savePassword} className="border border-zinc-800 bg-zinc-950 p-8 space-y-4">
          <h2 className="text-2xl font-black uppercase text-white mb-4">Password</h2>
          <input value={password.currentPassword} onChange={(event) => setPassword({ ...password, currentPassword: event.target.value })} type="password" required placeholder="Current password" className="w-full bg-zinc-900 border border-zinc-800 p-4 text-white" />
          <input value={password.newPassword} onChange={(event) => setPassword({ ...password, newPassword: event.target.value })} type="password" required placeholder="New password" className="w-full bg-zinc-900 border border-zinc-800 p-4 text-white" />
          <button disabled={loading} className="rounded-full bg-primary px-8 py-3 font-black uppercase text-white disabled:opacity-60">Change Password</button>
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
                    <p className="text-sm text-zinc-400">{item.street}, {item.area}, {item.city}</p>
                    <p className="text-sm text-zinc-500">{item.phone}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button type="button" onClick={() => edit(item)} className="border border-zinc-700 px-4 py-2 text-xs font-black uppercase text-white">Edit</button>
                  <button type="button" onClick={() => action(() => setDefaultAddress(getId(item)), 'Default address updated.')} className="border border-zinc-700 px-4 py-2 text-xs font-black uppercase text-white">Default</button>
                  <button type="button" onClick={() => action(() => deleteAddress(getId(item)), 'Address deleted.')} className="border border-zinc-700 px-4 py-2 text-xs font-black uppercase text-white">Delete</button>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={saveAddress} className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {(['fullName', 'phone', 'city', 'area', 'street', 'buildingNumber', 'apartmentNumber', 'notes'] as (keyof Address)[]).map((key) => (
              <input key={key} value={String(address[key] || '')} onChange={(event) => setAddress({ ...address, [key]: event.target.value })} placeholder={key.replace(/([A-Z])/g, ' $1')} className={`${key === 'street' || key === 'notes' ? 'md:col-span-2' : ''} bg-zinc-900 border border-zinc-800 p-4 text-white`} />
            ))}
            <button disabled={loading} className="md:col-span-2 rounded-full bg-primary px-8 py-3 font-black uppercase text-white disabled:opacity-60">{editingId ? 'Update Address' : 'Add Address'}</button>
          </form>
        </div>
      </section>
    </div>
  );
}
