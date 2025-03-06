import {
  ArrowDownIcon,
  ArrowUpIcon,
  KeyIcon,
  ShieldCheckIcon,
  UserIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { Component } from "react";

interface Props {
  key: any;
  icon: any;
  title: string;
  value: number | string;
  trend: number;
}

const StatisticsCard = ({ icon, title, value, trend }: Props) => {
  const trendColor = trend > 0 ? "text-green-500" : "text-red-500";

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="p-6 bg-white rounded-xl shadow-md flex items-center gap-4"
    >
      <div className="p-3 bg-blue-100 rounded-lg text-blue-500">{icon}</div>

      <div>
        <h3 className="text-gray-500 text-sm mb-1">{title}</h3>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold">{value}</span>
          <span className={`flex items-center ${trendColor}`}>
            {trend}%
            {trend > 0 ? (
              <ArrowUpIcon width={16} />
            ) : (
              <ArrowDownIcon width={16} />
            )}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const StatisticsCards = () => {
  const stats = [
    { icon: <UsersIcon />, title: "کل کاربران", value: "1,234", trend: 12 },
    { icon: <ShieldCheckIcon />, title: "ادمین‌ها", value: "45", trend: 5 },
    { icon: <UserIcon />, title: "دستیارها", value: "89", trend: -3 },
    { icon: <KeyIcon />, title: "فعالیت امروز", value: "256", trend: 8 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <StatisticsCard key={index} {...stat} />
      ))}
    </div>
  );
};


export default StatisticsCards;