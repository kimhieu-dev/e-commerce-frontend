import { User, Truck, ShieldCheck } from 'lucide-react';

const roles = [
  { id: 'USER', label: 'Khách hàng', icon: <User size={20} /> },
  { id: 'SHIPPER', label: 'Shipper', icon: <Truck size={20} /> },
  { id: 'ADMIN', label: 'Admin', icon: <ShieldCheck size={20} /> },
];

const RoleSelector = ({ activeRole, setActiveRole }) => {
  return (
    <div className="flex bg-gray-100 p-1 rounded-lg mb-6">
      {roles.map((role) => (
        <button
          key={role.id}
          onClick={() => setActiveRole(role.id)}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-all rounded-md ${
            activeRole === role.id
              ? 'bg-white text-blue-700 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {role.icon}
          {role.label}
        </button>
      ))}
    </div>
  );
};

export default RoleSelector;