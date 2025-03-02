"use client";
import { feachers } from "@/constants/homePageConsts";
import { motion } from "framer-motion";
import Link from "next/link";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-800 dark:to-gray-900">
      <div className=" [background-image:url('/hero.png')] bg-no-repeat bg-cover">
        <div className="max-w-7xl mx-auto py-16 bg-slate-900/60">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold mb-6 text-blue-600 dark:text-blue-400">
              سیستم مدیریت آزمون‌ها
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              ابزار حرفه‌ای برای تحلیل و مدیریت آزمون‌های آموزشی
            </p>

            <div className="flex justify-center items-center gap-4">
              {/* <motion.img
                src="/hero.png"
                alt="Exam Illustration"
                className="mb-12 max-w-52 rounded-lg overflow-hidden rotate-45"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1 }}
              /> */}

              <div className="flex justify-center gap-4">
                <Link
                  href="/tests"
                  className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors text-lg"
                >
                  شروع کنید
                </Link>
              </div>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mt-24">
            {feachers.map((feature, idx) => (
              <motion.div
                key={idx}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
                whileHover={{ y: -5 }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
