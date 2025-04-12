"use client";
import GlowImageBox from "@/components/layout/GlowImageBox";
import { feachers } from "@/constants/homePageConsts";
import { ArrowLongRightIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "primereact/button";

const Home = () => {
  return (
    <div className="min-h-screen">
      <div className=" [background-image:url('/hero.png') bg-no-repeat bg-cover bg-center">
        <div className="backdrop-blur-3x">
          <div className="max-w-7xl mx-auto py-16 px-5">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-5xl font-bold mb-6 text-blue-600 dark:text-blue-400">
                سیستم مدیریت آزمون‌ها
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 mt-8">
                ابزار حرفه‌ای برای تحلیل و مدیریت آزمون‌های آموزشی
              </p>

              <div className="flex justify-center items-center gap-4">
                <div className="flex justify-center gap-4">
                  <Link
                    href="/exams"
                    className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors text-lg"
                  >
                    شروع کنید
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* <motion.div>
              <section className="flex justify-center items-center mt-10 animate-bounce ">
                <GlowImageBox className="group scale-100 hover:scale-[2] !transition-transform">
                  <Button className="bg-slate-900 !p-3 text-2xl">
                    <Link href='/timer' className="flex gap-7">
                      <ArrowLongRightIcon
                        width={32}
                        className="-translate-x-1 group-hover:translate-x-1 transition-transform"
                      />
                      تایمر
                    </Link>
                  </Button>
                </GlowImageBox>
              </section>
            </motion.div> */}

            <div className="grid md:grid-cols-3 gap-8 mt-24">
              {feachers.map((feature, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -5 }}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="glass p-6 rounded-xl shadow-lg hover:!-translate-y-3 hover:!delay-0 !transition-transform duration-500"
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  <h3 className="text-xl font-semibold mb-4 !text-white">
                    {feature.title}
                  </h3>
                  <p className="!text-gray-300">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
