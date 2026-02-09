"use client";

import React, { useState } from "react";

type Tab = "policy" | "terms";

function AboutContainer() {
    const [activeTab, setActiveTab] = useState<Tab>("policy");

    return (
        <div className="min-h-screen overflow-y-auto md:p-6">
            <div className="max-w-4xl mx-auto space-y-6 pb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        เกี่ยวกับเรา
                    </h1>
                    <p className="text-gray-500 mt-1">
                        นโยบายความเป็นส่วนตัวและข้อกำหนดการให้บริการ Chula Bio Academy
                    </p>
                </div>

                <div className="flex gap-2 border-b border-gray-200 pb-0">
                    <button
                        className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                            activeTab === "policy"
                                ? "bg-white border border-b-white border-gray-200 -mb-px text-(--pink2)"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                        onClick={() => setActiveTab("policy")}
                    >
                        <i className="fa-solid fa-shield-halved mr-2" />
                        นโยบายความเป็นส่วนตัว
                    </button>
                    <button
                        className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                            activeTab === "terms"
                                ? "bg-white border border-b-white border-gray-200 -mb-px text-(--pink2)"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                        onClick={() => setActiveTab("terms")}
                    >
                        <i className="fa-solid fa-file-contract mr-2" />
                        ข้อกำหนดการให้บริการ
                    </button>
                </div>

                {activeTab === "policy" ? <PrivacyPolicy /> : <TermsOfService />}
            </div>
        </div>
    );
}

function SectionCard({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 space-y-6">
            {children}
        </div>
    );
}

function SectionTitle({ icon, children }: { icon: string; children: React.ReactNode }) {
    return (
        <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <i className={`${icon} text-(--pink2)`} />
            {children}
        </h2>
    );
}

function PrivacyPolicy() {
    return (
        <SectionCard>
            <div>
                <h2 className="text-xl font-bold text-gray-900">นโยบายความเป็นส่วนตัว</h2>
                <p className="text-sm text-gray-400 mt-1">ปรับปรุงล่าสุด: 1 มกราคม 2568</p>
            </div>

            <p className="text-gray-600 leading-relaxed">
                Chula Bio Academy (&quot;เรา&quot;) ให้ความสำคัญกับการคุ้มครองข้อมูลส่วนบุคคลของผู้ใช้งาน
                นโยบายฉบับนี้อธิบายถึงวิธีการเก็บรวบรวม ใช้ เปิดเผย
                และคุ้มครองข้อมูลส่วนบุคคลของท่านตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA)
            </p>

            <hr className="border-gray-100" />

            <section className="space-y-3">
                <SectionTitle icon="fa-solid fa-database">1. ข้อมูลที่เราเก็บรวบรวม</SectionTitle>
                <p className="text-gray-600 leading-relaxed">เราเก็บรวบรวมข้อมูลส่วนบุคคลของท่านดังต่อไปนี้:</p>
                <ul className="list-disc list-inside space-y-1.5 text-gray-600 ml-2">
                    <li>ชื่อ-นามสกุล, คำนำหน้า</li>
                    <li>อีเมล (ผ่านบัญชี Google)</li>
                    <li>ระดับชั้นการศึกษาและชื่อสถานศึกษา</li>
                    <li>ข้อมูลการแพ้อาหาร (ถ้ามี)</li>
                    <li>ชื่อผู้ปกครองและอีเมลผู้ปกครอง</li>
                    <li>ประวัติการสมัครกิจกรรมและการชำระเงิน</li>
                </ul>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3">
                <SectionTitle icon="fa-solid fa-bullseye">2. วัตถุประสงค์ในการใช้ข้อมูล</SectionTitle>
                <ul className="list-disc list-inside space-y-1.5 text-gray-600 ml-2">
                    <li>จัดการบัญชีผู้ใช้และการยืนยันตัวตน</li>
                    <li>ดำเนินการสมัครกิจกรรมและจัดการที่นั่ง</li>
                    <li>ประมวลผลการชำระเงินผ่านระบบ PromptPay</li>
                    <li>ติดต่อสื่อสารเกี่ยวกับกิจกรรมที่ท่านสมัคร</li>
                    <li>จัดทำสถิติและปรับปรุงการให้บริการ</li>
                </ul>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3">
                <SectionTitle icon="fa-solid fa-lock">3. การรักษาความปลอดภัยของข้อมูล</SectionTitle>
                <p className="text-gray-600 leading-relaxed">
                    เราใช้มาตรการรักษาความปลอดภัยที่เหมาะสมเพื่อป้องกันการเข้าถึง การเปลี่ยนแปลง
                    การเปิดเผย หรือการทำลายข้อมูลส่วนบุคคลโดยไม่ได้รับอนุญาต ซึ่งรวมถึง:
                </p>
                <ul className="list-disc list-inside space-y-1.5 text-gray-600 ml-2">
                    <li>การยืนยันตัวตนผ่าน Google OAuth 2.0</li>
                    <li>การเข้ารหัสข้อมูลระหว่างการส่งผ่าน HTTPS</li>
                    <li>การจำกัดสิทธิ์การเข้าถึงข้อมูลตามบทบาท (สมาชิก/ผู้ดูแลระบบ)</li>
                </ul>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3">
                <SectionTitle icon="fa-solid fa-user-shield">4. สิทธิ์ของเจ้าของข้อมูล</SectionTitle>
                <p className="text-gray-600 leading-relaxed">ท่านมีสิทธิ์ตาม PDPA ดังนี้:</p>
                <ul className="list-disc list-inside space-y-1.5 text-gray-600 ml-2">
                    <li>สิทธิ์ในการเข้าถึงและขอรับสำเนาข้อมูลส่วนบุคคล</li>
                    <li>สิทธิ์ในการแก้ไขข้อมูลส่วนบุคคลให้ถูกต้อง</li>
                    <li>สิทธิ์ในการลบข้อมูลส่วนบุคคล</li>
                    <li>สิทธิ์ในการระงับการใช้ข้อมูลส่วนบุคคล</li>
                    <li>สิทธิ์ในการคัดค้านการเก็บรวบรวม ใช้ หรือเปิดเผยข้อมูลส่วนบุคคล</li>
                    <li>สิทธิ์ในการถอนความยินยอม</li>
                </ul>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3">
                <SectionTitle icon="fa-solid fa-envelope">5. ช่องทางการติดต่อ</SectionTitle>
                <p className="text-gray-600 leading-relaxed">
                    หากท่านมีคำถามเกี่ยวกับนโยบายความเป็นส่วนตัว หรือต้องการใช้สิทธิ์ของเจ้าของข้อมูล
                    สามารถติดต่อได้ที่:
                </p>
                <div className="bg-(--primary) rounded-lg p-4 space-y-1 text-gray-600">
                    <p><strong>Chula Bio Academy</strong></p>
                    <p>จุฬาลงกรณ์มหาวิทยาลัย</p>
                    <p>
                        <i className="fa-solid fa-envelope mr-2 text-(--pink2)" />
                        Sittiporn.p@Chula.ac.th
                    </p>
                    <p>
                        <i className="fa-solid fa-phone mr-2 text-(--pink2)" />
                        063-978-2954
                    </p>
                </div>
            </section>
        </SectionCard>
    );
}

function TermsOfService() {
    return (
        <SectionCard>
            <div>
                <h2 className="text-xl font-bold text-gray-900">ข้อกำหนดการให้บริการ</h2>
                <p className="text-sm text-gray-400 mt-1">ปรับปรุงล่าสุด: 1 มกราคม 2568</p>
            </div>

            <p className="text-gray-600 leading-relaxed">
                ข้อกำหนดฉบับนี้ระบุเงื่อนไขการใช้งานแพลตฟอร์ม Chula Bio Academy
                การใช้งานแพลตฟอร์มถือว่าท่านยอมรับข้อกำหนดเหล่านี้ทั้งหมด
            </p>

            <hr className="border-gray-100" />

            <section className="space-y-3">
                <SectionTitle icon="fa-solid fa-circle-info">1. ขอบเขตการให้บริการ</SectionTitle>
                <p className="text-gray-600 leading-relaxed">
                    Chula Bio Academy เป็นแพลตฟอร์มลงทะเบียนกิจกรรมทางวิชาการของจุฬาลงกรณ์มหาวิทยาลัย
                    ซึ่งให้บริการดังต่อไปนี้:
                </p>
                <ul className="list-disc list-inside space-y-1.5 text-gray-600 ml-2">
                    <li>เรียกดูและสมัครกิจกรรมทางวิชาการ</li>
                    <li>ชำระเงินค่าสมัครผ่านระบบ PromptPay</li>
                    <li>จัดการข้อมูลผู้สมัคร (ข้อมูลนักเรียน)</li>
                    <li>ตรวจสอบประวัติการทำธุรกรรม</li>
                </ul>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3">
                <SectionTitle icon="fa-solid fa-user-check">2. การลงทะเบียนและบัญชีผู้ใช้</SectionTitle>
                <ul className="list-disc list-inside space-y-1.5 text-gray-600 ml-2">
                    <li>ผู้ใช้งานต้องเข้าสู่ระบบผ่านบัญชี Google</li>
                    <li>ผู้ใช้งานต้องกรอกข้อมูลนักเรียนที่ถูกต้องและเป็นปัจจุบัน</li>
                    <li>ผู้ใช้งานมีหน้าที่รับผิดชอบในการรักษาความปลอดภัยของบัญชีตนเอง</li>
                    <li>ห้ามใช้บัญชีของผู้อื่นในการสมัครกิจกรรม</li>
                </ul>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3">
                <SectionTitle icon="fa-solid fa-clipboard-list">3. การสมัครกิจกรรม</SectionTitle>
                <ul className="list-disc list-inside space-y-1.5 text-gray-600 ml-2">
                    <li>การสมัครกิจกรรมจะสมบูรณ์เมื่อได้ชำระเงินและได้รับการอนุมัติจากผู้ดูแลระบบ</li>
                    <li>จำนวนผู้สมัครในแต่ละกิจกรรมมีจำกัดตามที่กำหนด</li>
                    <li>ผู้สมัครต้องทำการสมัครภายในช่วงเวลาที่เปิดรับสมัคร</li>
                    <li>ผู้ดูแลระบบมีสิทธิ์พิจารณาอนุมัติหรือปฏิเสธการสมัครได้</li>
                </ul>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3">
                <SectionTitle icon="fa-solid fa-money-bill-wave">4. การชำระเงินและการคืนเงิน</SectionTitle>
                <ul className="list-disc list-inside space-y-1.5 text-gray-600 ml-2">
                    <li>การชำระเงินดำเนินการผ่านระบบเติมเงิน (Top-up) และหักยอดจากบัญชีภายในระบบ</li>
                    <li>การเติมเงินผ่าน PromptPay จะต้องอัปโหลดหลักฐานการชำระเงินเพื่อรอการตรวจสอบ</li>
                    <li>การคืนเงินจะพิจารณาเป็นรายกรณีโดยผู้ดูแลระบบ</li>
                    <li>ในกรณีสละสิทธิ์ การคืนเงินจะเป็นไปตามเงื่อนไขของแต่ละกิจกรรม</li>
                </ul>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3">
                <SectionTitle icon="fa-solid fa-ban">5. ข้อห้ามในการใช้งาน</SectionTitle>
                <p className="text-gray-600 leading-relaxed">ผู้ใช้งานต้องไม่กระทำการดังต่อไปนี้:</p>
                <ul className="list-disc list-inside space-y-1.5 text-gray-600 ml-2">
                    <li>ให้ข้อมูลเท็จหรือแอบอ้างเป็นบุคคลอื่น</li>
                    <li>พยายามเข้าถึงระบบหรือข้อมูลโดยไม่ได้รับอนุญาต</li>
                    <li>กระทำการที่อาจทำให้ระบบเสียหายหรือหยุดชะงัก</li>
                    <li>ใช้แพลตฟอร์มเพื่อวัตถุประสงค์ที่ผิดกฎหมาย</li>
                </ul>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3">
                <SectionTitle icon="fa-solid fa-scale-balanced">6. การจำกัดความรับผิดชอบ</SectionTitle>
                <p className="text-gray-600 leading-relaxed">
                    Chula Bio Academy ให้บริการตามสภาพ (&quot;as is&quot;) เราไม่รับประกันว่าบริการจะไม่มีข้อผิดพลาด
                    หรือจะสามารถใช้งานได้อย่างต่อเนื่องตลอดเวลา
                    เราจะไม่รับผิดชอบต่อความเสียหายใด ๆ ที่เกิดจากการใช้งานแพลตฟอร์ม
                    เว้นแต่จะเป็นความผิดจากความประมาทเลินเล่ออย่างร้ายแรงของเรา
                </p>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3">
                <SectionTitle icon="fa-solid fa-pen-to-square">7. การเปลี่ยนแปลงข้อกำหนด</SectionTitle>
                <p className="text-gray-600 leading-relaxed">
                    เราสงวนสิทธิ์ในการแก้ไขข้อกำหนดเหล่านี้ได้ตลอดเวลา
                    การเปลี่ยนแปลงจะมีผลทันทีเมื่อประกาศบนแพลตฟอร์ม
                    การใช้งานต่อหลังจากมีการเปลี่ยนแปลงถือว่าท่านยอมรับข้อกำหนดใหม่
                </p>
            </section>
        </SectionCard>
    );
}

export default AboutContainer;
