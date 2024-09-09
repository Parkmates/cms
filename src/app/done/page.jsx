export default function Done() {
  return (
    <div className="flex flex-col justify-center items-center p-10 text-center min-h-screen gap-10">
      <h1 className="text-3xl">Thank You!</h1>
      <div className="flex flex-col gap-5">
        <p>Your payment was successful. We appreciate your trust in us.</p>
        <p>You may now close this page.</p>
      </div>
    </div>
  );
}
