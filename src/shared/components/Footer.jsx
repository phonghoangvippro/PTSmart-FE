import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSettings } from '../../features/contact/contactAPI';
import './Footer.css';

const Footer = () => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getSettings();
        setSettings(data);
      } catch (err) {
        console.error('Footer: Failed to load settings', err);
      }
    };
    load();
  }, []);

  const hotline = settings?.hotline || '1900 8888';
  const email = settings?.support_email || settings?.email || 'support@ptsmart.vn';
  const address = settings?.address || '';
  const facebook = settings?.facebook_url || settings?.facebook || 'https://facebook.com';
  const zalo = settings?.zalo_url || settings?.zalo || 'https://zalo.me';
  const description = settings?.description || settings?.footer_text || 'Chuyên cung cấp các thiết bị điện tử chính hãng với mức giá cạnh tranh nhất thị trường. Hệ thống 64 cửa hàng toàn quốc.';

  return (
    <footer className="bg-white dark:bg-background-dark border-t border-gray-200 dark:border-gray-800 pt-16 pb-10">
      <div className="max-w-[1280px] mx-auto px-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="size-10 bg-primary rounded-lg flex items-center justify-center text-white">
                <span className="material-symbols-outlined">devices</span>
              </div>
              <h1 className="text-2xl font-bold text-primary">{settings?.site_name || 'PTSmart'}</h1>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              {description}
            </p>
            <div className="flex gap-4">
              <a className="size-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all" href={facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"><span className="material-symbols-outlined text-xl">social_leaderboard</span></a>
              <a className="size-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all" href={zalo} target="_blank" rel="noopener noreferrer" aria-label="Zalo"><span className="material-symbols-outlined text-xl">language</span></a>
              <a className="size-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all" href={`mailto:${email}`} aria-label="Email"><span className="material-symbols-outlined text-xl">alternate_email</span></a>
            </div>
          </div>
          
          {/* Footer Links */}
          <div>
            <h4 className="font-bold text-lg mb-6">Thông tin</h4>
            <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
              <li><Link className="hover:text-primary transition-colors" to="/lien-he">Về PTSmart</Link></li>
              <li><Link className="hover:text-primary transition-colors" to="/lien-he">Hệ thống cửa hàng</Link></li>
              <li><a className="hover:text-primary transition-colors" href="#careers">Tuyển dụng</a></li>
              <li><Link className="hover:text-primary transition-colors" to="/lien-he">Liên hệ bản quyền</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-6">Chính sách</h4>
            <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
              <li><a className="hover:text-primary transition-colors" href="#warranty">Chính sách bảo hành</a></li>
              <li><a className="hover:text-primary transition-colors" href="#returns">Chính sách đổi trả</a></li>
              <li><a className="hover:text-primary transition-colors" href="#shipping">Chính sách giao hàng</a></li>
              <li><a className="hover:text-primary transition-colors" href="#privacy">Bảo mật thông tin</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-6">Liên hệ</h4>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary">call</span>
                <div>
                  <p className="font-bold">Hotline miễn phí</p>
                  <p className="text-primary text-lg font-bold">{hotline}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary">mail</span>
                <div>
                  <p className="font-bold">Email hỗ trợ</p>
                  <p className="text-gray-500 dark:text-gray-400">{email}</p>
                </div>
              </div>
              {address && (
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary">location_on</span>
                  <div>
                    <p className="font-bold">Địa chỉ</p>
                    <p className="text-gray-500 dark:text-gray-400">{address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} {settings?.site_name || 'PTSmart'}. Tất cả quyền được bảo lưu.</p>
          <div className="flex gap-6">
            <img alt="Visa" className="h-4 opacity-50 grayscale hover:grayscale-0 transition-all" src="https://lh3.googleusercontent.com/aida-public/AB6AXuANGHY1PQbnEIMlfS6YnbCHgg7ShFi5tWAcqkvIp3kOHCD1eFdqWqbj8cxNijCVj58MEt9p4DWdpBHlu3XPJYGPcMLvCYsRS-OKnu9VHQqWcp49aReg4tbbOcAky00AS0HbpMBOd9orIUq66Bt0wB78cJGaffyAe8KHNkcVG_Et15Xssi44t422AFR48EHtXgy0fUlF5-_HF2_CAwx_EWwMp1AssJE9TTtW_x0h3WrfEyNZ9AqaQv4YMDpNN9O3_W4h_DIO8uW3MA" />
            <img alt="Mastercard" className="h-4 opacity-50 grayscale hover:grayscale-0 transition-all" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbWwaLPahJQaIT7L61ZBpM8VTqtiX-uEXBHqhDbHVVhOUhpsPvV5IbyRPbfMFEnAw_yewAlWvM1hfm3aoiMiV-zKku-F4sN4TOcHj97p8B8FpetvYjH7nNffko12rCVOK_RkKjaXXoe5Vmck97Db_StMza2IO-q4Oi5z1zm_sK5RRioHWDEItA1qidDtVVlle7m4QI0wqaY9_GG-mccDaTFqm4WTYyU4i6z0zf1siWX3aZB1rlTjyamH52zkyvw33X_grPO-F64g" />
            <img alt="Paypal" className="h-4 opacity-50 grayscale hover:grayscale-0 transition-all" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCitU772wKc2tudaZMFhSH-5xbXrD9OzjFlHhCHONHx0wgrf9WVy5_0Api8Yy0BzJGLH3mk4Qj11_oWFB5ZFOR7N0eTbg8ZGv0CTOigHhuNctG72_bIJmDnP5sMVFAT26TOh8iEIEYiVPUfpbmgrSD2qzIAMhBCp3dz7CIJCQRBW4R-MjpYXJpqUJURe4rO_KD1rSUGmiU1Hew_eWqJygBj38BADH8BuiT3Ove1TqngZoblgpR_i9E8FEgB_90-kZdClvmHZWoMLQ" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
