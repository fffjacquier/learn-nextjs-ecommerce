import { func } from "prop-types";
import Reset from "../components/Reset";
import RequestReset from "../components/RequestReset";

export default function resetPage({ query }) {
  if (!query?.token) {
    return <div>
      <p>Sorry you must supply a valid token</p>
      <RequestReset />
    </div>
  }
  return <div>
    <p>Reset your password</p>
    <Reset token={query.token} />
  </div>
}
