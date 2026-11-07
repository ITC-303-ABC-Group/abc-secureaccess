import { ShieldIcon } from "./Icons";

function Brand() {
  return (
    <div className="brand">
      <span className="brand-mark">
        <ShieldIcon width={22} height={22} />
      </span>
      <span className="brand-name">ABC SecureAccess</span>
    </div>
  );
}

export default Brand;
