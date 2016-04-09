package test;

import java.util.List;

import org.junit.*;
import org.junit.experimental.ParallelComputer;
import org.junit.runner.JUnitCore;
import org.junit.runner.Result;
import org.junit.runner.notification.Failure;

public class SmokeTest {

	@Test
	public void main(){

		Class[] cls={Smoke.class};
	    Result result = JUnitCore.runClasses(ParallelComputer.methods(), cls);
        for (Failure failure : result.getFailures()) {
            System.out.println(failure.toString());
         }
         System.out.println(result.wasSuccessful());

	}
}
