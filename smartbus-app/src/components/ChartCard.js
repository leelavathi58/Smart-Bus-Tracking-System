
function ChartCard({ title, children }) {

    return (

        <div className="chart-card">

            <div className="d-flex justify-content-between align-items-center mb-3">

                <h5 className="mb-0 fw-bold">

                    {title}

                </h5>

            </div>

            {children}

        </div>

    );

}

export default ChartCard;